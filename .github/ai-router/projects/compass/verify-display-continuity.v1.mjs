#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const ROOT=process.cwd();
const binding=Object.freeze({
  schema:'COMPASS_VOLUMETRIC_ARTIFACTS_OPERATION_BINDING_v1',
  operationId:'COMPASS_VOLUMETRIC_ARTIFACTS_BOUNDED_SUCCESSOR_20260817_v1',
  lockGeneration:1515,
  governingHead:'5166e04086efb2eb1bdd1ab043c18c84cef739ad',
  governingTree:'d0a4c3599a5ff39342a8cb3beae6d5a95e141c5b',
  contractSha256:'d341ba9ec50525df42df6073b50baee8e234b2400165ff45dcb902e602af6fa1',
  requestSha256:'5dc09f7e560fd45b7ebbacb2711ffec848469b428bb9b2f06818e25711b26e11',
  productIdentity:'compass-volumetric-artifacts-successor-v1',
  intakeIssue:1011,
  parentAuditComment:5317532443,
  preconstructionComment:5317597306,
  successorRequestComment:5317696796,
  successorReturnComment:5317702185,
  successorWorkflowRun:32045794547,
  transitionCommit:'07f6546a2639a1e0549b3e240c251834c008ce6e',
  protectedLiveFloorHead:'5166e04086efb2eb1bdd1ab043c18c84cef739ad',
  exactAdmittedMutationScope:Object.freeze([
    '.github/ai-router/projects/compass/verify-display-continuity.v1.mjs',
    '.github/ai-router/projects/compass/verify-performance-successor.mjs',
    '.github/workflows/compass-carousel-successor-live-qualification.yml',
    '.github/workflows/compass-display-continuity-validation.yml',
    '.github/workflows/compass-performance-successor-validation.yml',
    '.github/workflows/pages-direct-deploy.yml',
    'assets/compass/compass.brain-scene.js',
    'assets/compass/compass.trophy-scene.js',
    'assets/compass/compass.capability-carousel.css',
    'assets/compass/compass.capability-carousel.js',
    'index.html'
  ])
});
if(process.argv.includes('--binding')){console.log(JSON.stringify(binding,null,2));process.exit(0)}

const OUTPUT=process.env.COMPASS_VERIFICATION_OUTPUT||'/tmp/compass-display-continuity-verification-receipt.json';
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');const json=file=>JSON.parse(read(file));const git=args=>spawnSync('git',args,{cwd:ROOT,encoding:'utf8'});const checks=[];const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});
const router=json('.github/ai-router/router.v1.json'),entrypoint=json('.github/ai-router/projects/compass/entrypoint.v1.json'),contract=json('.github/ai-router/projects/compass/route-display-contract.v1.json'),plan=json('.github/ai-router/projects/compass/construction-execution-plan.v2.json'),interaction=json('.github/ai-router/projects/compass/construction-execution-plan.v2.interaction-diagnostic-amendment.json');
const html=read('index.html'),controller=read('assets/compass/compass.controller.js'),cosmos=read('assets/compass/compass.cosmos.js'),coreCss=read('assets/compass/compass-core.css'),css=read('assets/compass/compass.css'),capability=read('assets/compass/compass.capability-carousel.js'),capabilityCss=read('assets/compass/compass.capability-carousel.css'),brain=read('assets/compass/compass.brain-scene.js'),trophy=read('assets/compass/compass.trophy-scene.js'),input=read('assets/compass/compass.orbit-input.js');
const workflowFiles=['.github/workflows/compass-display-continuity-validation.yml','.github/workflows/compass-performance-successor-validation.yml','.github/workflows/compass-carousel-successor-live-qualification.yml','.github/workflows/pages-direct-deploy.yml'];const workflows=workflowFiles.map(read).join('\n');

check('FRESH_CANONICAL_BINDING',binding.operationId==='COMPASS_VOLUMETRIC_ARTIFACTS_BOUNDED_SUCCESSOR_20260817_v1'&&binding.lockGeneration===1515&&binding.governingHead==='5166e04086efb2eb1bdd1ab043c18c84cef739ad'&&binding.governingTree==='d0a4c3599a5ff39342a8cb3beae6d5a95e141c5b'&&binding.contractSha256.length===64&&binding.requestSha256.length===64&&binding.parentAuditComment===5317532443&&binding.preconstructionComment===5317597306&&binding.successorReturnComment===5317702185&&binding.successorWorkflowRun===32045794547&&binding.exactAdmittedMutationScope.length===11,binding);
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

check('MODULAR_SUCCESSOR_ONLY',!html.includes('compass.carousel.js')&&!html.includes('compass.carousel.css')&&['compass.orbit-input.js','compass.statement-carousel.js','compass.brain-scene.js','compass.capability-carousel.js'].every(file=>html.includes(file)),'modular successor');
check('CAPABILITY_EXACT_THREE',(['diagnostic','awards','house'].every(id=>capability.includes(`dataset.capability='${id}'`)))&&capability.includes('cards.length'),'three peer capabilities');
check('AWARDS_NOT_NESTED',capability.indexOf("dataset.capability='awards'")<capability.indexOf("dataset.capability='house'")&&!/data-capability="awards"[\s\S]{0,900}data-house-orbit/.test(capability),'Awards peer; House owns nested state');
check('HOUSE_CANONICAL_ROUTES',['/showroom/globe/hearth/jeeves/','/elara/','/products/auren/'].every(route=>capability.includes(route)),'three repository-backed routes');
check('PROOF_INDEPENDENT_STATE',capability.includes('function mountProof()')&&capability.includes("new CustomEvent('compass:proof-change'")&&!capability.includes("compass:proof-change',{detail:{capability"),'proof owns separate index');
check('ANATOMICAL_WEBGL_DEPTH',brain.includes("version:'anatomical-webgl-v2'")&&brain.includes('brainDepthRatio')&&brain.includes('gl.readPixels')&&(brain.match(/gl\.drawElements\(/g)||[]).length===1,'combined volumetric mesh');
check('BRAIN_VOLUMETRIC_GENERATION_1515',brain.includes("brainVolumetricPass:'generation-1515'")&&brain.includes('foldCross')&&brain.includes("brainLighting:'warm-key,cool-rim,dark-fill'")&&!brain.includes('folds=.78+.22*sin'),'actual fold-normal and directional-light pass');
check('TROPHY_PROCEDURAL_WEBGL',trophy.includes("version:'procedural-webgl-v1'")&&trophy.includes("lathe('bowl-inner'")&&trophy.includes("handle('handle-left'")&&trophy.includes("handle('handle-right'")&&trophy.includes("lathe('stem'")&&trophy.includes("lathe('base'")&&trophy.includes("powerPreference:'low-power'")&&trophy.includes('devicePixelRatio||1,2')&&trophy.includes('(t-start)/800')&&trophy.includes('gl.readPixels'),'concave procedural trophy with finite motion and capture API');
check('TROPHY_INTEGRATED_WITH_FALLBACK',capability.includes('/assets/compass/compass.trophy-scene.js?v=compass-volumetric-artifacts-v1')&&capability.includes('compass-trophy-canvas')&&capability.includes('compass-trophy-fallback')&&capability.includes('CompassTrophyScene?.activate()')&&capability.includes("volumetricArtifacts:'generation-1515'"),'WebGL primary with compact static fallback');
check('SHARED_ARTIFACT_LIGHTING',brain.includes('warm-key,cool-rim,dark-fill')&&trophy.includes('vec3(.30,.72,.82)')&&trophy.includes('vec3(.98,.78,.36)'),'dark-world warm-key cool-rim contract');
check('ATOMIC_INPUT_SHARED',input.includes("addEventListener('pointerup'")&&!input.includes('style.transform')&&capability.match(/CompassOrbitInput\?\.claimSwipe/g)?.length>=3,'release-only shared gesture law');

const stale=['COMPASS_AWARDS_TRL_BRAIN_FULL_CYCLE_SUCCESSOR_20260816_v1','compass-awards-trl-brain-successor-v1','lockGeneration:1509','COMPASS_INTERACTION_AND_DIAGNOSTIC_SUCCESSOR_20260816_v5','successor-v5','ad395e724cbfea1c19c9ce43393c1148fa557816','lockGeneration:1507'];
check('NO_STALE_SUCCESSOR_BINDING',stale.every(value=>!workflows.includes(value)),stale.filter(value=>workflows.includes(value)));
check('EXACT_CANDIDATE_CHECKOUTS',(workflows.match(/ref: \$\{\{ github\.event\.pull_request\.head\.sha \|\| github\.sha \}\}/g)||[]).length>=2,'candidate workflows bind exact head');
check('DEPLOYMENT_DOES_NOT_REWRITE_PRODUCT',!read('.github/workflows/pages-direct-deploy.yml').includes('re.sub(')&&!read('.github/workflows/pages-direct-deploy.yml').includes("path.write_text("),'candidate bytes copied unchanged');
check('LIVE_GATE_REQUIRES_BYTE_MANIFEST',read('.github/workflows/compass-carousel-successor-live-qualification.yml').includes('sha256')&&read('.github/workflows/compass-carousel-successor-live-qualification.yml').includes('workflow_run'),'post-deployment exact bytes');

const governing=git(['rev-parse','--verify',`${binding.governingHead}^{commit}`]);check('GOVERNING_BASE_RESOLVES',governing.status===0&&governing.stdout.trim()===binding.governingHead,{status:governing.status,resolved:governing.stdout.trim(),error:governing.stderr.trim()});
const scopeBase=(process.env.COMPASS_SCOPE_BASE||binding.governingHead).trim(),scopeResolved=git(['rev-parse','--verify',`${scopeBase}^{commit}`]),governingAncestor=git(['merge-base','--is-ancestor',binding.governingHead,scopeBase]),scopeAncestor=git(['merge-base','--is-ancestor',scopeBase,'HEAD']);
check('SCOPE_BASE_LAWFUL_DESCENDANT',scopeResolved.status===0&&scopeResolved.stdout.trim()===scopeBase&&governingAncestor.status===0&&scopeAncestor.status===0,{scopeBase,resolved:scopeResolved.stdout.trim(),governingAncestor:governingAncestor.status===0,headDescendsFromScope:scopeAncestor.status===0});
const changedResult=git(['diff','--name-only',`${scopeBase}...HEAD`]);if(changedResult.status===0){const changed=changedResult.stdout.split(/\r?\n/).filter(Boolean),allowed=new Set(binding.exactAdmittedMutationScope);check('EXACT_SCOPE_ONLY',changed.length>0&&changed.every(file=>allowed.has(file)),{scopeBase,changed,allowed:[...allowed]});check('NO_PROHIBITED_PATH_MUTATION',changed.every(file=>!['door/','home/','showroom/','h-earth-3d/','laws/','evidence/','governance/','products/','build/'].some(prefix=>file.startsWith(prefix))),changed)}else{check('EXACT_SCOPE_ONLY',false,changedResult.stderr);check('NO_PROHIBITED_PATH_MUTATION',false,changedResult.stderr)}
const worktree=git(['status','--porcelain','--untracked-files=no']);check('CANDIDATE_WORKTREE_CLEAN',worktree.status===0&&worktree.stdout.trim()==='',worktree.stdout.trim().split(/\r?\n/).filter(Boolean));
const checked=git(['rev-parse','HEAD^{commit}']),candidateHead=(process.env.COMPASS_CANDIDATE_HEAD||checked.stdout||'').trim();check('EXACT_CANDIDATE_HEAD_BOUND',checked.status===0&&/^[0-9a-f]{40}$/.test(candidateHead)&&checked.stdout.trim()===candidateHead,{requested:process.env.COMPASS_CANDIDATE_HEAD||null,checkedOut:checked.stdout.trim()});

const failures=checks.filter(item=>!item.pass);const receipt={...binding,schema:'COMPASS_VOLUMETRIC_ARTIFACTS_DISPLAY_CONTINUITY_RECEIPT_v1',candidateHead,scopeBase,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',runtimeQualification:'REQUIRES_WORKFLOW_BROWSER_EVIDENCE',checks,failures:failures.map(item=>item.id)};fs.writeFileSync(OUTPUT,`${JSON.stringify(receipt,null,2)}\n`);console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
