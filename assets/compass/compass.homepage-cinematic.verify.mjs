#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const host=read('assets/compass/compass.orientation-cinematic.js');
const css=read('assets/compass/compass.orientation-cinematic.css');
const custody=json('assets/compass/cinematic-media/manifest.v1.json');
const r6=json('assets/compass/cinematic-media/v2-r6-r10-release-20260907-001/r6-master-proof.v1.json');
const r7=json('assets/compass/cinematic-media/v2-r6-r10-release-20260907-001/r7-custody-proof.v1.json');

const EXPECTED=Object.freeze({
  operationId:'COMPASS_V2_R6_R10_MASTER_PLAYER_RELEASE_20260907_001',
  r7Commit:'650a0ce31d5667821fc6c0827cd95ee1874c4ba8',
  mediaPath:'assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4',
  mediaBytes:2723640,
  mediaSha256:'0326240cf1d3d8cf7753b91ea1cd0206378b8db7e37590b8bb39c37f6b50f444',
  mediaGitBlob:'b48bc48e531c3eb29bd1a94a91725badd30186f5',
  masterDurationMs:38000,
  entryPrerollMs:4350
});

const checks=[];
const check=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail:String(detail||'')});
const has=s=>host.includes(s);

check('R8_MANIFEST_STATUS',custody.status==='R8_SUCCESSOR_PLAYER_BOUND_TO_R7_V2_MASTER',custody.status);
check('OPERATION_ID_BOUND',custody.operationId===EXPECTED.operationId&&r6.operationId===EXPECTED.operationId&&r7.operationId===EXPECTED.operationId);
check('R7_CUSTODY_CLOSED',r7.result==='R7_V2_GIT_CUSTODY_CLOSED'&&r7.committedReadback?.branchReachable===true&&r7.committedReadback?.pathResolvesToExactGitBlob===true);
check('R8_SOURCE_HEAD_IS_R7',custody.r7CustodyCommit===EXPECTED.r7Commit&&has(`sourceHead:'${EXPECTED.r7Commit}'`));
check('R6_R7_MASTER_IDENTITY_MATCH',r6.master?.bytes===EXPECTED.mediaBytes&&r6.master?.sha256===EXPECTED.mediaSha256&&r6.master?.expectedGitBlob===EXPECTED.mediaGitBlob&&r7.master?.bytes===EXPECTED.mediaBytes&&r7.master?.sha256===EXPECTED.mediaSha256&&r7.master?.gitBlob===EXPECTED.mediaGitBlob);
check('R8_MASTER_IDENTITY_MATCH',custody.master?.path===EXPECTED.mediaPath&&custody.master?.bytes===EXPECTED.mediaBytes&&custody.master?.sha256===EXPECTED.mediaSha256&&custody.master?.gitBlob===EXPECTED.mediaGitBlob&&has(`mediaBytes:${EXPECTED.mediaBytes}`)&&has(`mediaSha256:'${EXPECTED.mediaSha256}'`)&&has(`mediaGitBlob:'${EXPECTED.mediaGitBlob}'`));
check('MASTER_DURATION_38000',custody.masterDurationMs===EXPECTED.masterDurationMs&&custody.master?.durationMs===EXPECTED.masterDurationMs&&has(`masterDurationMs:${EXPECTED.masterDurationMs}`));
check('ENTRY_PREROLL_4350_OUTSIDE_MASTER',custody.entryPrerollMs===EXPECTED.entryPrerollMs&&custody.entryPrerollCountedInMaster===false&&custody.entry?.durationMs===EXPECTED.entryPrerollMs&&custody.entry?.countedInMaster===false&&has(`entryPrerollMs:${EXPECTED.entryPrerollMs}`)&&has('entryPrerollCountedInMaster:false'));
check('DIRECT_V1_TO_V2_ONLY',custody.invariants?.directV1ToV2Only===true);
check('NO_SECOND_MASTER_CLOCK_DECLARED',custody.invariants?.masterClockAdded===false&&custody.invariants?.secondaryCinematicRuntimeAdded===false);
check('R8_THIN_STATE_MACHINE',has("const STATE=Object.freeze({ARMED:'ARMED',PLAYING:'PLAYING',SETTLED:'SETTLED'})"));
check('PLAY_REDUCED_MOTION_SETTLES',has("if(reduced()){settle('reduced-motion-complete');return;}"));
check('ESCAPE_SETTLES',has("if(event.key==='Escape')")&&has("settle(session.state===STATE.PLAYING?'skip-playing':session.playRequested?'skip-preroll':'skip-armed')"));
check('SKIP_SETTLES',has("event.target.closest('[data-main-orientation-skip]')")&&has("'skip-playing'"));
check('NATURAL_COMPLETION_SETTLES',has("video.addEventListener('ended',()=>settle('complete'),{once:true})"));
check('FAIL_OPEN_MEDIA_ERROR',has("video.addEventListener('error',()=>settle('fail-open'),{once:true})")&&has("settle('fail-open')"));
check('FIRST_FRAME_GATE_RVFC',has("typeof video.requestVideoFrameCallback==='function'")&&has('video.requestVideoFrameCallback(()=>revealFirstPresentedFrame())'));
check('FIRST_FRAME_GATE_FALLBACK',has("video.addEventListener('playing',()=>requestAnimationFrame(revealFirstPresentedFrame),{once:true})")&&has("video.readyState>=2&&video.currentTime>0"));
check('PREROLL_WAITS_FOR_FRAME_1',has("elapsed>=CONTRACT.entryPrerollMs&&!session.entryTransitionComplete")&&has("session.overlay.dataset.entryState='PREROLL_COMPLETE_WAITING_FOR_FRAME_1'"));
const revealStart=host.indexOf('function revealFirstPresentedFrame()');
const revealEnd=host.indexOf('async function maybeStartMasterPlayback()',revealStart);
const reveal=revealStart>=0&&revealEnd>revealStart?host.slice(revealStart,revealEnd):'';
check('ZERO_BLANK_HANDOFF_ORDER',reveal.includes("session.overlay.dataset.firstFramePresentedBeforeEntryClear='true'")&&reveal.indexOf("firstFramePresentedBeforeEntryClear='true'")<reveal.indexOf("session.gate?.setAttribute('hidden','')")&&reveal.indexOf("session.gate?.setAttribute('hidden','')")<reveal.indexOf('markState(STATE.PLAYING)'));
check('MANIFEST_ZERO_BLANK_CONTRACT',custody.entry?.zeroBlankHandoff==='FIRST_V2_VIDEO_FRAME_PRESENTED_BEFORE_ENTRY_MATERIAL_CLEARS'&&custody.invariants?.entryClearsBeforeFirstV2Frame===false);
check('PRODUCT_INERT_CAPTURE_RESTORE',has('root.inert=true')&&has('root.inert=session.rootInert')&&has("root.setAttribute('aria-hidden','true')")&&has("root.removeAttribute('aria-hidden')"));
check('AMBIENT_CAPTURE_RESTORE',has('session.ambientSnapshot=Object.freeze({')&&has('audio.muted=snap.muted')&&has('audio.volume=snap.volume'));
check('FOCUS_RESTORE_OR_REPLAY',has('session.priorFocus?.isConnected')&&has('session.priorFocus.focus({preventScroll:true})')&&has('replay.focus({preventScroll:true})'));
check('URL_HISTORY_OBSERVED_NOT_MUTATED',has('urlUnchanged:location.href===session.url')&&has('historyUnchanged:history.length===session.historyLength')&&!/(history\.(pushState|replaceState)|location\.(assign|replace)|window\.open\s*\()/u.test(host));
check('NO_ANALYTICS_WRITE',custody.invariants?.analyticsWrites===false&&!/analytics\s*\(/iu.test(host));
check('NO_NAVIGATION_WRITE',custody.invariants?.navigationWrites===false);
check('REDUCED_MOTION_CSS',css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('.compass-prerendered-player__video,.compass-prerendered-player__entry-canvas{display:none!important}'));
check('ENTRY_TRANSITION_ACTION_ISOLATION',css.includes('.compass-prerendered-player[data-entry-state="TRANSITION"] .compass-prerendered-player__actions{pointer-events:none}'));
check('PROTECTED_AUTHORITIES_DECLARED',[
  'assets/compass/cinematic-media/compass-main-orientation-final-v1.mp4',
  'assets/compass/compass.controller.js',
  'assets/compass/compass.crystals.js',
  'assets/compass/compass.readiness-context-v1.js',
  'assets/compass/compass.capability-carousel.core.js',
  'assets/compass/compass.capability-carousel.js',
  'assets/compass/compass.mirrorland-window.js',
  'characters/**','showroom/**','navigation/**','analytics/**'
].every(p=>custody.protectedUnchanged?.includes(p)));
check('R9_OWNER_ACCEPTANCE_NOT_INFERRED',custody.qualification?.ownerAcceptance==='NOT_YET_REQUESTED'&&custody.qualification?.r10==='BLOCKED_BY_R9_OWNER_ACCEPTANCE');
check('SUCCESSOR_NOT_LIVE',custody.activationState==='SUCCESSOR_BRANCH_REVIEW_ONLY_NOT_LIVE');

const failed=checks.filter(c=>!c.pass);
for(const item of checks)console.log(`${item.pass?'PASS':'FAIL'} ${item.name}${item.detail?` :: ${item.detail}`:''}`);
console.log(`RESULT ${failed.length===0?'PASS':'FAIL'} ${checks.length-failed.length}/${checks.length}`);
if(failed.length)process.exitCode=1;
