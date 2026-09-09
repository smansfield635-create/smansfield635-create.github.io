#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const file=value=>path.join(root,value);
const read=value=>fs.readFileSync(file(value),'utf8');
const json=value=>JSON.parse(read(value));
const mediaPath='assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4';
const evidenceRoot='assets/compass/cinematic-media/r11a-v8-experiential-integration-20260909-001';
const media=fs.readFileSync(file(mediaPath));
const host=read('assets/compass/compass.orientation-cinematic.js');
const finalSource=read('assets/compass/compass.orientation-cinematic.final.js');
const css=read('assets/compass/compass.orientation-cinematic.css');
const html=read('index.html');
const custody=json('assets/compass/cinematic-media/manifest.v1.json');
const timing=json(`${evidenceRoot}/timing-and-integration-contract.v1.json`);
const acceptance=json(`${evidenceRoot}/owner-acceptance.v1.json`);
const technical=json(`${evidenceRoot}/technical-qualification.v1.json`);
const release=json(`${evidenceRoot}/release-manifest.v1.json`);
const EXPECTED=Object.freeze({
  operationId:'COMPASS_R11A_V8_EXPERIENTIAL_INTEGRATION_20260909_001_SUCCESSOR_001',
  lockGeneration:2027,
  governingMain:'4a228b7322ffc2bf71fae7ee103bae1a81725460',
  playerContract:'COMPASS_EXPERIENTIAL_PLAYER_R11A_V8',
  mediaBytes:8925582,
  mediaSha256:'746606b76fbd05e9278787c25d484d001c67e18ba22f3890e95eee50e42ba29c',
  mediaGitBlob:'f2fad2e98bd712b226a9c52c764e92a7dd0b46da',
  durationMs:59967,
  frameCount:1799
});

const sha256=createHash('sha256').update(media).digest('hex');
const gitBlob=createHash('sha1').update(`blob ${media.length}\0`).update(media).digest('hex');
const probeRun=spawnSync('ffprobe',['-v','error','-show_entries','format=duration,size:stream=index,codec_name,profile,width,height,r_frame_rate,avg_frame_rate,pix_fmt,color_range,color_space,color_transfer,color_primaries,sample_rate,channels,channel_layout,nb_frames','-of','json',file(mediaPath)],{encoding:'utf8'});
const probe=probeRun.status===0?JSON.parse(probeRun.stdout):{streams:[],format:{}};
const video=probe.streams?.find(stream=>stream.codec_name==='h264')||{};
const audio=probe.streams?.find(stream=>stream.codec_name==='aac')||{};
const decode=spawnSync('ffmpeg',['-v','error','-i',file(mediaPath),'-map','0:v:0','-map','0:a:0','-f','null','-'],{encoding:'utf8'});
const silence=spawnSync('ffmpeg',['-hide_banner','-nostats','-i',file(mediaPath),'-af','silencedetect=noise=-50dB:d=0.5','-f','null','-'],{encoding:'utf8'});
const syntaxFiles=['assets/compass/compass.orientation-cinematic.js','assets/compass/compass.orientation-cinematic.final.js',`${evidenceRoot}/construction-source.v1.mjs`];
const syntax=syntaxFiles.map(value=>({value,result:spawnSync('node',['--check',file(value)],{encoding:'utf8'})}));
const diff=spawnSync('git',['diff','--name-only',EXPECTED.governingMain,'--'],{encoding:'utf8'});
const changed=new Set(diff.stdout.trim().split(/\r?\n/).filter(Boolean));
const allowed=new Set([
  'index.html','assets/compass/compass.orientation-cinematic.css','assets/compass/compass.orientation-cinematic.js','assets/compass/compass.orientation-cinematic.final.js','assets/compass/compass.homepage-cinematic.verify.mjs','assets/compass/cinematic-media/manifest.v1.json',mediaPath,
  `${evidenceRoot}/construction-source.v1.mjs`,`${evidenceRoot}/timing-and-integration-contract.v1.json`,`${evidenceRoot}/technical-qualification.v1.json`,`${evidenceRoot}/owner-acceptance.v1.json`,`${evidenceRoot}/release-manifest.v1.json`
]);
const playBody=host.slice(host.indexOf('function play(){'),host.indexOf('\nfunction skip(){'));
const skipBody=host.slice(host.indexOf('function skip(){'),host.indexOf('\nfunction onOverlayClick'));
const renderS08=finalSource.slice(finalSource.indexOf('function renderS08('),finalSource.indexOf('\n  function renderFrame',finalSource.indexOf('function renderS08(')));
const checks=[];
const check=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail:String(detail||'')});
const has=value=>host.includes(value);

check('MEDIA_BYTES',media.length===EXPECTED.mediaBytes,media.length);
check('MEDIA_SHA256',sha256===EXPECTED.mediaSha256,sha256);
check('MEDIA_GIT_BLOB',gitBlob===EXPECTED.mediaGitBlob,gitBlob);
check('MEDIA_DECODE',decode.status===0,decode.stderr);
check('VIDEO_PROFILE',video.profile==='High'&&video.width===1280&&video.height===720&&video.pix_fmt==='yuv420p'&&video.r_frame_rate==='30/1'&&video.avg_frame_rate==='30/1',JSON.stringify(video));
check('VIDEO_BT709_LIMITED',video.color_range==='tv'&&video.color_space==='bt709'&&video.color_transfer==='bt709'&&video.color_primaries==='bt709',JSON.stringify(video));
check('FRAME_COUNT',Number(video.nb_frames)===EXPECTED.frameCount,video.nb_frames);
check('DURATION',Math.round(Number(probe.format?.duration)*1000)===EXPECTED.durationMs,probe.format?.duration);
check('AUDIO_PROFILE',audio.profile==='LC'&&String(audio.sample_rate)==='48000'&&audio.channels===2&&audio.channel_layout==='stereo',JSON.stringify(audio));
check('NO_HALF_SECOND_SILENT_GAP',silence.status===0&&!/silence_(start|end)/.test(silence.stderr),silence.stderr.match(/silence_(start|end)[^\n]*/g)?.join('; ')||'none');
check('SYNTAX',syntax.every(item=>item.result.status===0),syntax.filter(item=>item.result.status!==0).map(item=>`${item.value}:${item.result.stderr}`).join('; '));

check('AUTHORITY_BOUND',[custody,timing,acceptance,technical,release].every(value=>value.operationId===EXPECTED.operationId&&value.lockGeneration===EXPECTED.lockGeneration));
check('GOVERNING_HEAD_BOUND',[custody,timing,technical,release].every(value=>value.governingMain===EXPECTED.governingMain));
check('MASTER_CUSTODY',custody.master?.bytes===EXPECTED.mediaBytes&&custody.master?.sha256===EXPECTED.mediaSha256&&custody.master?.gitBlob===EXPECTED.mediaGitBlob&&technical.master?.sha256===EXPECTED.mediaSha256);
check('PREPUBLICATION_ONLY',acceptance.status==='PENDING_OWNER_REVIEW'&&acceptance.ownerAcceptanceIsInferred===false&&release.mergeAuthorized===false&&release.deploymentAuthorized===false&&release.liveMutationPerformed===false);
check('EXACT_PATH_BOUNDARY',diff.status===0&&[...changed].every(value=>allowed.has(value)),[...changed].filter(value=>!allowed.has(value)).join(','));

check('PLAYER_CONTRACT',has(`version:'${EXPECTED.playerContract}'`)&&has(`operationId:'${EXPECTED.operationId}'`)&&has('lockGeneration:2027'));
check('PLAYER_MASTER_IDENTITY',has(`mediaBytes:${EXPECTED.mediaBytes}`)&&has(`mediaSha256:'${EXPECTED.mediaSha256}'`)&&has(`mediaGitBlob:'${EXPECTED.mediaGitBlob}'`)&&has(`masterDurationMs:${EXPECTED.durationMs}`));
check('CACHE_BUSTED_MEDIA',has("mediaPath:'/assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4?v=r11a-v8-review&cb=746606b76fbd05e9'")&&html.includes('data-compass-orientation-cinematic="r11a-v8-review"'));
check('ACTUAL_DOM_PLAY_DISSOLVE',playBody.includes("session.entryAction='play'")&&playBody.includes("buildEntryTessellation(q('[data-main-orientation-entry-card]',session.overlay))")&&playBody.includes('requestAnimationFrame(drawEntryTransition)'));
check('ACTUAL_DOM_SKIP_DISSOLVE',skipBody.includes("session.entryAction=playing?'skip-playing':'skip-armed'")&&skipBody.includes("classList.add('is-skip-handoff')")&&skipBody.includes('requestAnimationFrame(drawEntryTransition)'));
check('SIMULATED_ENTRY_REMOVED',custody.source?.removedSimulatedEntryFrames?.[1]===144&&custody.entry?.simulatedGateInsideMaster===false&&custody.invariants?.simulatedEntryRemoved===true&&!has('drawEntryCompass'));
check('FILM_PASSIVE_AFTER_ENTRY',custody.entry?.filmInteractivity==='NONE_AFTER_ENTRY_CHOICE'&&!/(pointermove|touchmove)/.test(host));
check('FULL_VIEWPORT_EXPERIENTIAL_REGION',custody.viewport?.law==='ONE_CONTINUOUS_EXPERIENTIAL_REGION'&&css.includes('.compass-prerendered-player__ambient-video')&&css.includes('object-fit:cover')&&css.includes('mask-image:linear-gradient')&&!css.includes('aspect-ratio:16/9'));
check('AUDRALIA_HOLD',timing.timing?.audraliaAdditionalHoldFrames===90&&timing.timing?.audraliaAdditionalHoldMs===3000);
check('SLOWER_CODA',timing.timing?.closingTraversalScale===1.6&&custody.invariants?.closingTraversalScale===1.6);
check('CANONICAL_LIVE_TERMINAL',custody.invariants?.inventedTerminalCompassFrames===0&&custody.invariants?.canonicalLiveFourStarCompassIsTerminalSurface===true&&timing.terminal?.movieProxyCompassAllowed===false&&renderS08.includes("s08.style.opacity='0'")&&!renderS08.includes('drawConstellation'));
check('NATURAL_LIVE_HANDOFF',has('naturalFadeMs:2200')&&has("overlay.classList.add('is-natural-handoff')")&&css.includes('transition:opacity 2200ms'));
check('PRODUCT_RESTORATION',has('root.inert=true')&&has('root.inert=session.rootInert')&&has("root.removeAttribute('aria-hidden')"));
check('SKIP_REPLAY_REDUCED_MOTION',has("button.addEventListener('click',()=>mount('replay'))")&&skipBody.includes("if(reduced()){settle('reduced-motion-skip');return;}"));
check('URL_HISTORY_UNCHANGED',has('urlUnchanged:location.href===session.url')&&has('historyUnchanged:history.length===session.historyLength')&&!/(history\.(pushState|replaceState)|location\.(assign|replace)|window\.open\s*\()/u.test(host));

const failed=checks.filter(item=>!item.pass);
for(const item of checks)console.log(`${item.pass?'PASS':'FAIL'} ${item.name}${item.detail?` :: ${item.detail}`:''}`);
console.log(`RESULT ${failed.length===0?'PASS':'FAIL'} ${checks.length-failed.length}/${checks.length}`);
if(failed.length)process.exitCode=1;
