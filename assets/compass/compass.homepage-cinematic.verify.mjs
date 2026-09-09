#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const file=p=>path.join(root,p);
const read=p=>fs.readFileSync(file(p),'utf8');
const json=p=>JSON.parse(read(p));
const mediaPath='assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4';
const media=fs.readFileSync(file(mediaPath));
const host=read('assets/compass/compass.orientation-cinematic.js');
const css=read('assets/compass/compass.orientation-cinematic.css');
const html=read('index.html');
const custody=json('assets/compass/cinematic-media/manifest.v1.json');
const acceptance=json('assets/compass/cinematic-media/r11a-v7-live-release-20260908-001/owner-source-and-cinematic-acceptance.v1.json');
const technical=json('assets/compass/cinematic-media/r11a-v7-live-release-20260908-001/technical-qualification.v1.json');
const release=json('assets/compass/cinematic-media/r11a-v7-live-release-20260908-001/release-manifest.v1.json');

const EXPECTED=Object.freeze({
  operationId:'COMPASS_R11A_V7_LIVE_REPLACEMENT_20260909_001',
  lockGeneration:2022,
  governingMain:'49fd160e1cb462feefd328c1472fe6001f277747',
  playerContract:'COMPASS_PRERENDERED_THIN_PLAYER_R11A_V7',
  mediaPath,
  mediaBytes:8869131,
  mediaSha256:'9641cf6653d1317d5b69b0310cfea301723da4ddd4cce8be15d4a7fcde23e919',
  mediaGitBlob:'326d1c5b887262c6c828b3c8920a4b2e6f91d30b',
  durationMs:56900,
  frameCount:1707,
  acceptedT10:'0f52601bf88e629f22e0c9307808939814efbaa192d9839b7701d7afea040c2e'
});

const sha256=createHash('sha256').update(media).digest('hex');
const gitBlob=createHash('sha1').update(`blob ${media.length}\0`).update(media).digest('hex');
const probeRun=spawnSync('ffprobe',['-v','error','-show_entries','format=duration,size:stream=index,codec_name,profile,width,height,r_frame_rate,avg_frame_rate,pix_fmt,color_range,color_space,color_transfer,color_primaries,sample_rate,channels,channel_layout,nb_frames','-of','json',file(mediaPath)],{encoding:'utf8'});
const probe=probeRun.status===0?JSON.parse(probeRun.stdout):{streams:[],format:{}};
const video=probe.streams?.find(s=>s.codec_name==='h264')||{};
const audio=probe.streams?.find(s=>s.codec_name==='aac')||{};
const decode=spawnSync('ffmpeg',['-v','error','-i',file(mediaPath),'-map','0:v:0','-map','0:a:0','-f','null','-'],{encoding:'utf8'});
const silence=spawnSync('ffmpeg',['-hide_banner','-nostats','-i',file(mediaPath),'-af','silencedetect=noise=-50dB:d=0.5','-f','null','-'],{encoding:'utf8'});
const checks=[];
const check=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail:String(detail||'')});
const has=s=>host.includes(s);
const playStart=host.indexOf('function play(){');
const playEnd=host.indexOf('\nfunction onOverlayClick',playStart);
const playBody=playStart>=0&&playEnd>playStart?host.slice(playStart,playEnd):'';

check('MEDIA_BYTES',media.length===EXPECTED.mediaBytes,media.length);
check('MEDIA_SHA256',sha256===EXPECTED.mediaSha256,sha256);
check('MEDIA_GIT_BLOB',gitBlob===EXPECTED.mediaGitBlob,gitBlob);
check('MEDIA_DECODE',decode.status===0,decode.stderr);
check('VIDEO_PROFILE',video.profile==='High'&&video.width===1280&&video.height===720&&video.pix_fmt==='yuv420p'&&video.r_frame_rate==='30/1'&&video.avg_frame_rate==='30/1',JSON.stringify(video));
check('VIDEO_BT709_LIMITED',video.color_range==='tv'&&video.color_space==='bt709'&&video.color_transfer==='bt709'&&video.color_primaries==='bt709',JSON.stringify(video));
check('FRAME_COUNT',Number(video.nb_frames)===EXPECTED.frameCount,video.nb_frames);
check('DURATION',Math.round(Number(probe.format?.duration)*1000)===EXPECTED.durationMs,probe.format?.duration);
check('AUDIO_PROFILE',audio.profile==='LC'&&String(audio.sample_rate)==='48000'&&audio.channels===2&&audio.channel_layout==='stereo',JSON.stringify(audio));
check('NO_SILENT_GAP',silence.status===0&&!/silence_(start|end)/.test(silence.stderr),silence.stderr.match(/silence_(start|end)[^\n]*/g)?.join('; ')||'none');

check('CUSTODY_STATUS',custody.status==='R11A_V7_LIVE_REPLACEMENT_QUALIFIED',custody.status);
check('AUTHORITY_BOUND',[custody,acceptance,technical,release].every(v=>v.operationId===EXPECTED.operationId&&v.lockGeneration===EXPECTED.lockGeneration));
check('GOVERNING_HEAD_BOUND',custody.governingMain===EXPECTED.governingMain&&release.governingMain===EXPECTED.governingMain);
check('MASTER_CUSTODY',[custody.master,acceptance.acceptedMaster,technical.master].every(v=>v.path===EXPECTED.mediaPath&&v.bytes===EXPECTED.mediaBytes&&v.sha256===EXPECTED.mediaSha256&&v.durationMs===EXPECTED.durationMs&&v.frameCount===EXPECTED.frameCount));
check('MUSIC_CUSTODY',custody.music?.acceptedSourceSha256===EXPECTED.acceptedT10&&acceptance.acceptedMusic?.sourceSha256===EXPECTED.acceptedT10&&acceptance.acceptedMusic?.embeddedInMaster===true&&technical.audio?.acceptedT10SourceSha256===EXPECTED.acceptedT10);
check('SIGNATURE_MIRRORLAND',custody.invariants?.signatureColoredMirrorlandPanes===true&&custody.visualSequence?.[0]==='COMMUNITY_BODIES_ASSEMBLE_SIGNATURE_COLORED_MIRRORLAND_PANES');
check('CANONICAL_AUDRALIA',custody.invariants?.canonicalAudraliaOnly===true&&custody.visualSequence?.includes('CAMERA_CROSSES_WINDOW_INTO_CANONICAL_AUDRALIA'));
check('PIXEL_RECONFIGURATION_SEQUENCE',[
  'AUDRALIA_PIXELATES_AND_RECONFIGURES_TO_BRAIN',
  'BRAIN_PIXELATES_AND_RECONFIGURES_TO_TROPHY',
  'TROPHY_PIXELATES_AND_RECONFIGURES_TO_HOUSE',
  'HOUSE_PIXELATES_AND_RECONFIGURES_TO_FINAL_COMPASS_HANDOFF'
].every(value=>custody.visualSequence?.includes(value)));
check('OWNER_ACCEPTANCE_EXPLICIT',acceptance.status==='OWNER_ACCEPTED_AND_ORDERED_LIVE_REPLACEMENT'&&acceptance.ownerAcceptanceIsInferred===false&&acceptance.ownerDisposition?.releaseDirection==='UNHOOK_CURRENT_LIVE_INTRO_AND_HOOK_ACCEPTED_SUCCESSOR_IN');
check('TECHNICAL_QUALIFICATION',technical.status==='PASS'&&technical.verification?.fullVideoAndAudioDecode==='PASS_1707_FRAMES');
check('RELEASE_SUCCESSOR_IDENTITY',release.successorSha256===EXPECTED.mediaSha256&&release.successorGitBlob===EXPECTED.mediaGitBlob&&release.retiredExternalPrerollMs===4350&&release.newExternalPrerollMs===0);

check('PLAYER_CONTRACT',has(`version:'${EXPECTED.playerContract}'`)&&has(`operationId:'${EXPECTED.operationId}'`));
check('PLAYER_MASTER_IDENTITY',has(`mediaBytes:${EXPECTED.mediaBytes}`)&&has(`mediaSha256:'${EXPECTED.mediaSha256}'`)&&has(`mediaGitBlob:'${EXPECTED.mediaGitBlob}'`)&&has(`masterDurationMs:${EXPECTED.durationMs}`));
check('CACHE_BUSTED_MEDIA',has("mediaPath:'/assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4?v=r11a-v7-live&cb=9641cf6653d1317d'")&&has('video.src=CONTRACT.mediaPath'));
check('NO_EXTERNAL_PREROLL',custody.entryPrerollMs===0&&custody.entryPrerollCountedInMaster===true&&has('entryPrerollMs:0')&&has('entryPrerollCountedInMaster:true')&&has("data-entry-preroll-counted-in-master','true'"));
check('DIRECT_MASTER_START',playBody.includes('session.entryTransitionComplete=true')&&playBody.includes('void maybeStartMasterPlayback()')&&!playBody.includes('requestAnimationFrame(drawEntryTransition)')&&!playBody.includes('buildEntryTessellation'));
check('THIN_STATE_MACHINE',has("const STATE=Object.freeze({ARMED:'ARMED',PLAYING:'PLAYING',SETTLED:'SETTLED'})"));
check('REDUCED_MOTION_SETTLES',playBody.includes("if(reduced()){settle('reduced-motion-complete');return;}"));
check('ESCAPE_AND_SKIP_SETTLE',has("if(event.key==='Escape')")&&has("event.target.closest('[data-main-orientation-skip]')")&&has("'skip-playing'"));
check('NATURAL_COMPLETION',has("video.addEventListener('ended',()=>settle('complete'),{once:true})"));
check('MEDIA_ERROR_FAILS_OPEN',has("video.addEventListener('error',()=>settle('fail-open'),{once:true})"));
check('FIRST_FRAME_GATE',has("typeof video.requestVideoFrameCallback==='function'")&&has('video.requestVideoFrameCallback(()=>revealFirstPresentedFrame())')&&has("video.addEventListener('playing',()=>requestAnimationFrame(revealFirstPresentedFrame),{once:true})"));
const revealStart=host.indexOf('function revealFirstPresentedFrame()');
const revealEnd=host.indexOf('async function maybeStartMasterPlayback()',revealStart);
const reveal=revealStart>=0&&revealEnd>revealStart?host.slice(revealStart,revealEnd):'';
check('ZERO_BLANK_HANDOFF',reveal.includes("firstFramePresentedBeforeEntryClear='true'")&&reveal.indexOf("firstFramePresentedBeforeEntryClear='true'")<reveal.indexOf("session.gate?.setAttribute('hidden','')")&&reveal.indexOf("session.gate?.setAttribute('hidden','')")<reveal.indexOf('markState(STATE.PLAYING)'));
check('PRODUCT_RESTORATION',has('root.inert=true')&&has('root.inert=session.rootInert')&&has("root.removeAttribute('aria-hidden')"));
check('AMBIENT_RESTORATION',has('session.ambientSnapshot=Object.freeze({')&&has('audio.muted=snap.muted')&&has('audio.volume=snap.volume'));
check('REPLAY_PRESERVED',has("button.addEventListener('click',()=>mount('replay'))"));
check('URL_HISTORY_UNCHANGED',has('urlUnchanged:location.href===session.url')&&has('historyUnchanged:history.length===session.historyLength')&&!/(history\.(pushState|replaceState)|location\.(assign|replace)|window\.open\s*\()/u.test(host));
check('NO_ANALYTICS_WRITE',custody.invariants?.analyticsWrites===false&&!/analytics\s*\(/iu.test(host));
check('REDUCED_MOTION_CSS',css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('.compass-prerendered-player__video,.compass-prerendered-player__entry-canvas{display:none!important}'));
check('INDEX_LOADS_R11A',html.includes('data-compass-orientation-cinematic="r11a-v7-live"'));

try{new Function(host);check('PLAYER_SYNTAX',true);}catch(error){check('PLAYER_SYNTAX',false,error.message);}

const failed=checks.filter(value=>!value.pass);
for(const item of checks)console.log(`${item.pass?'PASS':'FAIL'} ${item.name}${item.detail?` :: ${item.detail}`:''}`);
console.log(`RESULT ${failed.length===0?'PASS':'FAIL'} ${checks.length-failed.length}/${checks.length}`);
if(failed.length)process.exitCode=1;
