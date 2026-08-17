#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const ROOT=process.cwd();
const binding=Object.freeze({
  schema:'COMPASS_AWARDS_TRL_BRAIN_OPERATION_BINDING_v1',
  operationId:'COMPASS_AWARDS_TRL_BRAIN_FULL_CYCLE_SUCCESSOR_20260816_v1',
  lockGeneration:1509,
  governingHead:'a16f4a38de6cd9f76ddf71a600b0ab525d64ecd8',
  governingTree:'99253d669d5cbfe89d87383401508fe1698e5433',
  contractSha256:'87c0f55115ef05306154462a1300cc5d566ecf7d8abe80999ea375d494db630b',
  productIdentity:'compass-awards-trl-brain-successor-v1',
  intakeIssue:1011,
  intakeComment:5311599352,
  intakeWorkflowRun:31992958534,
  exactAdmittedMutationScope:Object.freeze([
    '.github/ai-router/projects/compass/entrypoint.v1.json',
    '.github/ai-router/projects/compass/verify-display-continuity.v1.mjs',
    '.github/ai-router/projects/compass/verify-performance-successor.mjs',
    '.github/ai-router/router.v1.json',
    '.github/workflows/compass-carousel-successor-live-qualification.yml',
    '.github/workflows/compass-display-continuity-validation.yml',
    '.github/workflows/compass-performance-successor-validation.yml',
    '.github/workflows/pages-direct-deploy.yml',
    'assets/compass/compass.brain-scene.js',
    'assets/compass/compass.capability-carousel.css',
    'assets/compass/compass.capability-carousel.js',
    'index.html'
  ])
});
if(process.argv.includes('--binding')){console.log(JSON.stringify(binding,null,2));process.exit(0)}

const OUTPUT=process.env.COMPASS_VERIFICATION_OUTPUT||'/tmp/compass-display-continuity-verification-receipt.json';
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');const json=file=>JSON.parse(read(file));const git=args=>spawnSync('git',args,{cwd:ROOT,encoding:'utf8'});const checks=[];const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});
const router=json('.github/ai-router/router.v1.json'),entrypoint=json('.github/ai-router/projects/compass/entrypoint.v1.json'),contract=json('.github/ai-router/projects/compass/route-display-contract.v1.json'),plan=json('.github/ai-router/projects/compass/construction-execution-plan.v2.json'),interaction=json('.github/ai-router/projects/compass/construction-execution-plan.v2.interaction-diagnostic-amendment.json');
const html=read('index.html'),controller=read('assets/compass/compass.controller.js'),cosmos=read('assets/compass/compass.cosmos.js'),coreCss=read('assets/compass/compass-core.css'),css=read('assets/compass/compass.css'),capability=read('assets/compass/compass.capability-carousel.js'),capabilityCss=read('assets/compass/compass.capability-carousel.css'),brain=read('assets/compass/compass.brain-scene.js'),input=read('assets/compass/compass.orbit-input.js');
const workflowFiles=['.github/workflows/compass-display-continuity-validation.yml','.github/workflows/compass-performance-successor-validation.yml','.github/workflows/compass-carousel-successor-live-qualification.yml','.github/workflows/pages-direct-deploy.yml'];const workflows=workflowFiles.map(read).join('\n');

check('FRESH_CANONICAL_BINDING',binding.lockGeneration===1509&&binding.governingHead.length===40&&binding.contractSha256.length===64&&binding.intakeComment===5311599352,binding);
check('MANDATORY_CONTEXT_BOUND',entrypoint.procedures?.constructionPlan==='.github/ai-router/projects/compass/construction-execution-plan.v2.json'&&plan.status==='LOCKED_DIRECT_REFERENCE_REQUIRED'&&interaction.status==='LOCKED_DIRECT_REFERENCE_REQUIRED',{plan:plan.status,interaction:interaction.status});
check('ROUTE_DISPLAY_CONTRACT_PRESENT',contract.schema==='COMPASS_ROUTE_DISPLAY_CONTRACT_v1',contract.schema);
const compassRoute=router.projects?.find(project=>project.projectId==='COMPASS');
check('COMPASS_ROUTE_ACTIVE',compassRoute?.status==='ACTIVE_REGISTERED_PROJECT'&&entrypoint.status==='ACTIVE_REGISTERED_PROJECT',{router:compassRoute?.status,entrypoint:entrypoint.status});
for(const workflow of workflowFiles)check(`WORKFLOW_ROUTED_${path.basename(workflow).replaceAll(/[^a-zA-Z0-9]/g,'_').toUpperCase()}`,compassRoute?.ownedExactPaths?.includes(workflow)&&entrypoint.ownedExactPaths?.includes(workflow),workflow);
check('ROUTING_CREATES_NO_AUTHORITY',String(entrypoint.authorityBoundary||'').includes('DOES_NOT_CREATE_MUTATION_AUTHORITY'),entrypoint.authorityBoundary);

const staticResult=spawnSync(process.execPath,['.github/ai-router/projects/compass/verify-performance-successor.mjs'],{cwd:ROOT,encoding:'utf8'});
check('PERFORMANCE_SUCCESSOR_STATIC_PASS',staticResult.status===0,{status:staticResult.status,stdout:staticResult.stdout.slice(-1200),stderr:staticResult.stderr.slice(-1200)});
const cardinals=[['north','Orientation'],['east','Worlds'],['south','Instruments'],['west','Frontier']];for(const [id,label] of cardinals)check(`CARDINAL_${id.toUpperCase()}_PRESENT`,html.includes(`data-cardinal-id="${id}"`)&&html.includes(`data-coordinate-label="${label}"`),`${id}:${label}`);
check('EXACTLY_FOUR_PUBLIC_CARDINAL_IDS',(html.match(/data-cardinal-id="(north|east|south|west)"/g)||[]).length===4,'north,east,south,west');
check('ROOM_DECLARATION_COUNT_19',(html.match(/data-compass-room data-compass-destination/g)||[]).length===19,19);
check('MIRRORLAND_THRESHOLD_NOT_CARDINAL',html.includes('data-destination-type="mirrorland"')&&!/data-compass-cardinal[^>]*data-destination-type="mirrorland"/.test(html),'threshold only');
check('MIRRORLAND_INVITATIONAL_COPY',html.includes('Enter through the door to choose a world or experience.')&&!html.includes('See if you can find it'),'clear invitation');
check('MIRRORLAND_THREE_ROUTES',['href="/showroom/">Enter the Narrative','href="/showroom/globe/h-earth/">Enter the Demo','href="/showroom/globe/audralia/">See the World Map'].every(value=>html.includes(value)),'three routes');
check('GLOBAL_GUIDANCE_CORRECT',html.includes('Drag to rotate the constellation. Tap a primary star to open its cluster.'),'global pointer language');
check('CLUSTER_GUIDANCE_BOUND',controller.includes('Drag to rotate the cluster. Tap a room star to select it. Swipe across open space to return to the constellation.'),'cluster language');
check('INTRODUCTION_RECOVERABLE',html.includes('<details class="compass-introduction" data-compass-full-introduction>')&&html.includes('What if the next frontier is not outside the box, but outside the cube?'),'collapsed full introduction');
check('COSMOS_AND_CARDINAL_VISUAL_CONTINUITY',(cosmos.includes('Fibonacci')||cosmos.includes('golden')||cosmos.includes('GOLDEN'))&&css.includes('Mirrorland remains a threshold behind the map, never a fifth direction.'),'estate visual law');
check('RESPONSIVE_REDUCED_FOCUS_CONTINUITY',css.includes('@media (max-width: 820px)')&&css.includes('@media (max-width: 560px)')&&css.includes('@media (prefers-reduced-motion: reduce)')&&coreCss.includes(':focus-visible')&&capabilityCss.includes('@media(prefers-reduced-motion:reduce)'),'responsive + reduced motion + focus');

check('MODULAR_SUCCESSOR_ONLY',!html.includes('compass.carousel.js')&&!html.includes('compass.carousel.css')&&['compass.orbit-input.js','compass.statement-carousel.js','compass.brain-scene.js','compass.capability-carousel.js'].every(file=>html.includes(file)),'six-module successor');
check('CAPABILITY_EXACT_THREE',(['diagnostic','awards','house'].every(id=>capability.includes(`dataset.capability='${id}'`)))&&capability.includes('cards.length'),'three peer capabilities');
check('AWARDS_NOT_NESTED',capability.indexOf("dataset.capability='awards'")<capability.indexOf("dataset.capability='house'")&&!/data-capability="awards"[\s\S]{0,900}data-house-orbit/.test(capability),'Awards peer; House owns nested state');
check('HOUSE_CANONICAL_ROUTES',['/showroom/globe/hearth/jeeves/','/elara/','/products/auren/'].every(route=>capability.includes(route)),'three repository-backed routes');
check('PROOF_INDEPENDENT_STATE',capability.includes('function mountProof()')&&capability.includes("new CustomEvent('compass:proof-change'")&&!capability.includes("compass:proof-change',{detail:{capability"),'proof owns separate index');
check('ANATOMICAL_WEBGL_DEPTH',brain.includes("version:'anatomical-webgl-v2'")&&brain.includes('brainDepthRatio')&&brain.includes('gl.readPixels')&&(brain.match(/gl\.drawElements\(/g)||[]).length===1,'combined volumetric mesh');
check('ATOMIC_INPUT_SHARED',input.includes("addEventListener('pointerup'")&&!input.includes('style.transform')&&capability.match(/CompassOrbitInput\?\.claimSwipe/g)?.length>=3,'release-only shared gesture law');

const stale=['COMPASS_INTERACTION_AND_DIAGNOSTIC_SUCCESSOR_20260816_v5','successor-v5','ad395e724cbfea1c19c9ce43393c1148fa557816','lockGeneration:1507'];
check('NO_STALE_SUCCESSOR_BINDING',stale.every(value=>!workflows.includes(value)),stale.filter(value=>workflows.includes(value)));
check('EXACT_CANDIDATE_CHECKOUTS',(workflows.match(/ref: \$\{\{ github\.event\.pull_request\.head\.sha \|\| github\.sha \}\}/g)||[]).length>=2,'candidate workflows bind exact head');
check('DEPLOYMENT_DOES_NOT_REWRITE_PRODUCT',!read('.github/workflows/pages-direct-deploy.yml').includes('re.sub(')&&!read('.github/workflows/pages-direct-deploy.yml').includes("path.write_text("),'candidate bytes copied unchanged');
check('LIVE_GATE_REQUIRES_BYTE_MANIFEST',read('.github/workflows/compass-carousel-successor-live-qualification.yml').includes('sha256')&&read('.github/workflows/compass-carousel-successor-live-qualification.yml').includes('workflow_run'),'post-deployment exact bytes');

const governing=git(['rev-parse','--verify',`${binding.governingHead}^{commit}`]);check('GOVERNING_BASE_RESOLVES',governing.status===0&&governing.stdout.trim()===binding.governingHead,{status:governing.status,resolved:governing.stdout.trim(),error:governing.stderr.trim()});
const changedResult=git(['diff','--name-only',`${binding.governingHead}...HEAD`]);if(changedResult.status===0){const changed=changedResult.stdout.split(/\r?\n/).filter(Boolean),allowed=new Set(binding.exactAdmittedMutationScope);check('EXACT_SCOPE_ONLY',changed.length>0&&changed.every(file=>allowed.has(file)),{changed,allowed:[...allowed]});check('NO_PROHIBITED_PATH_MUTATION',changed.every(file=>!['door/','home/','showroom/','h-earth-3d/','laws/','evidence/','governance/','products/','build/'].some(prefix=>file.startsWith(prefix))),changed)}else{check('EXACT_SCOPE_ONLY',false,changedResult.stderr);check('NO_PROHIBITED_PATH_MUTATION',false,changedResult.stderr)}
const worktree=git(['status','--porcelain','--untracked-files=no']);check('CANDIDATE_WORKTREE_CLEAN',worktree.status===0&&worktree.stdout.trim()==='',worktree.stdout.trim().split(/\r?\n/).filter(Boolean));
const checked=git(['rev-parse','HEAD^{commit}']),candidateHead=(process.env.COMPASS_CANDIDATE_HEAD||checked.stdout||'').trim();check('EXACT_CANDIDATE_HEAD_BOUND',checked.status===0&&/^[0-9a-f]{40}$/.test(candidateHead)&&checked.stdout.trim()===candidateHead,{requested:process.env.COMPASS_CANDIDATE_HEAD||null,checkedOut:checked.stdout.trim()});

const failures=checks.filter(item=>!item.pass);const receipt={schema:'COMPASS_AWARDS_TRL_BRAIN_DISPLAY_CONTINUITY_RECEIPT_v1',...binding,candidateHead,scopeBase:binding.governingHead,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',runtimeQualification:'REQUIRES_WORKFLOW_BROWSER_EVIDENCE',checks,failures:failures.map(item=>item.id)};fs.writeFileSync(OUTPUT,`${JSON.stringify(receipt,null,2)}\n`);console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
