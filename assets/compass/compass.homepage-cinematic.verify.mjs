#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const host=read('assets/compass/compass.orientation-cinematic.js');
const css=read('assets/compass/compass.orientation-cinematic.css');
const render=read('assets/compass/compass.orientation-cinematic.render.js');
const media=read('assets/compass/compass.orientation-cinematic.media.js');
const final=read('assets/compass/compass.orientation-cinematic.final.js');
const custody=JSON.parse(read('assets/compass/cinematic-media/manifest.v1.json'));
const combined=[host,css,render,media,final].join('\n');
const checks=[];
const check=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail:String(detail||'')});

check('MUTATION_CLASS_BOUNDED_PAGE_RELEASE',host.includes("mutationClass:'BOUNDED_PAGE_RELEASE'"));
check('ARCHIVED_MASTER_DURATION_38000',host.includes('const MASTER_DURATION_MS=38000')&&custody.masterDurationMs===38000);
check('ARCHIVED_ENTRY_PREROLL_4350',host.includes('const ENTRY_PREROLL_DURATION_MS=4350')&&custody.entryPrerollMs===4350);
const expectedShots=[['S01',0,4500],['S02',4500,9500],['S03',9500,14500],['S04',14500,19500],['S05',19500,25500],['S06',25500,30500],['S07',30500,34000],['S08',34000,38000]];
for(const[id,start,end]of expectedShots){
  check(`HOST_${id}_BOUNDARY`,host.includes(`id:'${id}'`)&&host.includes(`startMs:${start},endMs:${end}`),`${start}-${end}`);
  check(`CUSTODY_${id}_BOUNDARY`,custody.shots?.some(s=>s.id===id&&s.startMs===start&&s.endMs===end),`${start}-${end}`);
}
check('HOST_PUBLISHES_EXISTING_SHOT_ID',host.includes('session.overlay.dataset.shotId=shot.id'));
check('NO_SECOND_CONTEXT_STATE_MACHINE',custody.delta?.storyboardContext?.secondaryStateMachine===false&&custody.delta?.storyboardContext?.secondaryClock===false);
for(const marker of ['01 / ARRIVAL','02 / ORIENTATION','03 / GUIDED INTRODUCTION','04 / RESEARCH & READINESS','05 / MIRRORLAND','06 / AUDRALIA','07 / ENGAGE','08 / HANDOFF'])check(`CONTEXT_${marker.replace(/\W+/g,'_')}`,css.includes(marker),marker);
check('CONTEXT_CURRENT_TEXT_EXITS_FIRST',css.includes('@keyframes tour-current')&&css.includes('78%,100%{opacity:0'));
check('CONTEXT_NEXT_TEXT_ENTERS_BEFORE_BOUNDARY',css.includes('@keyframes tour-next')&&css.includes('96%,100%{opacity:1'));
check('CONTEXT_DOMINANT_LOCAL_CONTRAST',css.includes('background:linear-gradient(90deg,rgba(1,6,10,.86)')&&css.includes('text-shadow:0 3px 22px rgba(0,0,0,.96)'));
check('TOUR_CONTEXT_RESTART_GUARD_INSTALLED',media.includes("installCinematicTourContextRestartGuard();")&&media.includes("TOUR_CONTEXT_RESTART_STYLE_ID='compass-cinematic-tour-context-restart-guard'"));
check('TOUR_CONTEXT_RESTART_GUARD_COVERS_S01_S08',media.includes("const TOUR_CONTEXT_SHOTS=Object.freeze(['S01','S02','S03','S04','S05','S06','S07','S08']);")&&media.includes("style.dataset.cinematicTourContextRestart='S01_S08_UNIQUE_ANIMATION_NAMES'"));
check('TOUR_CONTEXT_CURRENT_NAME_UNIQUE_PER_SHOT',media.includes('`@keyframes tour-current-${slug}{${TOUR_CONTEXT_CURRENT_FRAMES}}`')&&media.includes('animation-name:tour-current-${slug}'));
check('TOUR_CONTEXT_NEXT_NAME_UNIQUE_PER_SUCCESSOR_SHOT',media.includes("if(id!=='S08')")&&media.includes('`@keyframes tour-next-${slug}{${TOUR_CONTEXT_NEXT_FRAMES}}`')&&media.includes('animation-name:tour-next-${slug}'));
check('TOUR_CONTEXT_RESTART_GUARD_NO_MASTER_CLOCK',!media.includes('requestAnimationFrame(')&&!media.includes('performance.now(')&&!media.includes('setInterval('));
check('NO_CHARACTER_COPY_IN_VISIBLE_CONTEXT',!css.includes('Meet the characters')&&!css.includes('Choose who you want to speak with'));
check('DONOR_INTERNAL_S07_COPY_HIDDEN',css.includes('.compass-orientation-cinematic[data-shot-id="S07"] .cinematic-breadth__heading')&&css.includes('.compass-orientation-cinematic[data-shot-id="S07"] .cinematic-breadth__caption{display:none!important}'));

check('S05_ARCHIVED_MIRRORLAND_PRESERVED',render.includes('const MIRROR_PANES=Object.freeze([')&&render.includes('Find the door to Mirrorland.'));
check('S05_NO_CHARACTERS_RUNTIME_IMPORT',!render.includes('/characters/')&&!render.includes("'characters/"));
check('S06_CURRENT_CANONICAL_RENDERER_PATH',render.includes("const AUDRALIA_RENDERER_URL='/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs'"));
check('S06_CANONICAL_CONSTRUCTOR',render.includes('module.createMapWideEnvironmentRenderer(audralia.canvas)'));
check('S06_CANONICAL_WORLD_MARKED',render.includes("root.dataset.audraliaFullWorldConstructor='true'"));
check('S06_CARTOON_RECONSTRUCTION_REMOVED',!render.includes('COMPASS_AUDRALIA_SOURCE_RECONSTRUCTION_v1')&&!render.includes('drawAudraliaSourceReconstruction')&&!render.includes('projectAudraliaSource'));

check('BRAIN_SOURCE_PRESERVED',final.includes("brain:Object.freeze({path:'assets/compass/compass.hra-brain-scene.js',blob:'c26603744e55c8ede2c82944bd0fd117d04dcbdb'})"));
check('TROPHY_SOURCE_PRESERVED',final.includes("trophy:Object.freeze({path:'assets/compass/compass.trophy-scene.js',blob:'d281e18b06128671ffe2a19e8fdb272cc5544e31'})"));
check('BRAIN_TROPHY_TRANSPARENT_CONTAINER',final.includes("iframe.style.background='transparent'")&&final.includes('background:transparent!important'));
check('HOUSE_SOURCE_PRESERVED',final.includes("house:Object.freeze({path:'assets/compass/compass.house-scene.js',blob:'a82e3c963a10808b9f8f1922faab45155ea4a62b'})"));
check('HOUSE_PHASE3_BOUND',final.includes("houseGothicPhase3:Object.freeze({path:'assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs',blob:'38bc8fa60a251681cb5484926409290f66460ad0'})")&&final.includes("contract:'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1'"));
check('HOUSE_FALLBACK_PROHIBITED',final.includes("fallbackPolicy:'RENDERER_FALLBACK_PROHIBITED'"));
check('S07_ACTIVE_KIND_DRIVES_EXISTING_OBJECT_SEQUENCE',final.includes('card.dataset.active=String(card.dataset.kind===kind)'));

check('MEDIA_REMAINS_38S',media.includes('endMs:38000')&&media.includes("id:'S08'"));
check('NO_NAVIGATION_WRITE',!/(location\.(assign|replace)|history\.(pushState|replaceState)|window\.open\s*\()/u.test(combined));
check('NO_ANALYTICS_DELTA',!/analytics\s*\(/iu.test(combined));
check('NO_CONTROLLER_MUTATION_PATH_IN_CUSTODY',Array.isArray(custody.protectedUnchanged)&&custody.protectedUnchanged.includes('assets/compass/compass.controller.js'));
check('NO_CHARACTER_SCENE',custody.delta?.house?.characterScenePresent===false);
check('NO_RETIMING',custody.animationRetimingPerformed===false);
check('PREHOOK_REPAIR_SCOPE_BOUNDED',Array.isArray(custody.preHookAuditRepair?.exactPaths)&&custody.preHookAuditRepair.exactPaths.length===3&&custody.preHookAuditRepair.exactPaths.includes('assets/compass/compass.orientation-cinematic.media.js')&&custody.preHookAuditRepair.exactPaths.includes('assets/compass/compass.homepage-cinematic.verify.mjs')&&custody.preHookAuditRepair.exactPaths.includes('assets/compass/cinematic-media/manifest.v1.json'));
check('HOOK_STILL_BLOCKED',custody.qualification?.ordinaryEntryHook==='BLOCKED_UNTIL_RENDERED_QUALIFICATION');

const failed=checks.filter(c=>!c.pass);
for(const item of checks)console.log(`${item.pass?'PASS':'FAIL'} ${item.name}${item.detail?` :: ${item.detail}`:''}`);
console.log(`RESULT ${failed.length===0?'PASS':'FAIL'} ${checks.length-failed.length}/${checks.length}`);
if(failed.length)process.exitCode=1;