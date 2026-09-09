#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const ROOT=process.cwd();
const MEDIA='assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4';
const POSTER='assets/compass/cinematic-media/compass-main-orientation-entry-frame.png';
const JS='assets/compass/compass.orientation-cinematic.js';
const HTML='index.html';
const ROOT_MANIFEST='assets/compass/cinematic-media/manifest.v1.json';
const EVIDENCE_MANIFEST='assets/compass/cinematic-media/r11a-v7-v8-hybrid-candidate-20260909-001/manifest.v1.json';
const EXPECTED={
  mediaSha:'507081bfe7290b201c357368649430b2de7b1c45bba141f2037e0b28f0faec01',
  mediaBytes:9141773,
  posterSha:'47ca784c3f67955554536852b96cb109547d83497d0dbef7edeb3ecd3dce1061',
  posterBytes:87700,
  frames:1943,
  duration:64.766667
};
const pass=[];
const fail=message=>{throw new Error(message);};
const check=(condition,label)=>{if(!condition)fail(label);pass.push(label);};
const bytes=async file=>(await fs.stat(path.join(ROOT,file))).size;
const sha256=async file=>createHash('sha256').update(await fs.readFile(path.join(ROOT,file))).digest('hex');
const run=(command,args,options={})=>{
  const result=spawnSync(command,args,{cwd:ROOT,encoding:'utf8',...options});
  if(result.status!==0)fail(`${command.toUpperCase()}_FAILED: ${result.stderr||result.stdout}`);
  return result.stdout;
};

check(await bytes(MEDIA)===EXPECTED.mediaBytes,'MEDIA_BYTES');
check(await sha256(MEDIA)===EXPECTED.mediaSha,'MEDIA_SHA256');
check(await bytes(POSTER)===EXPECTED.posterBytes,'POSTER_BYTES');
check(await sha256(POSTER)===EXPECTED.posterSha,'POSTER_SHA256');

const probe=JSON.parse(run('ffprobe',['-v','error','-show_entries','format=duration,size:stream=index,codec_name,codec_type,width,height,r_frame_rate,nb_frames,pix_fmt,color_space,color_transfer,color_primaries,sample_rate,channels','-of','json',MEDIA]));
const video=probe.streams.find(stream=>stream.codec_type==='video');
const audio=probe.streams.find(stream=>stream.codec_type==='audio');
check(video?.codec_name==='h264','VIDEO_H264');
check(video?.width===1280&&video?.height===720,'VIDEO_1280X720');
check(video?.r_frame_rate==='30/1'&&Number(video?.nb_frames)===EXPECTED.frames,'VIDEO_30FPS_1943_FRAMES');
check(video?.pix_fmt==='yuv420p'&&video?.color_space==='bt709'&&video?.color_transfer==='bt709'&&video?.color_primaries==='bt709','VIDEO_YUV420P_BT709');
check(audio?.codec_name==='aac'&&audio?.sample_rate==='48000'&&audio?.channels===2,'AUDIO_AAC_48KHZ_STEREO');
check(Math.abs(Number(probe.format.duration)-EXPECTED.duration)<0.00001,'DURATION_64766_667MS');

run('ffmpeg',['-v','error','-i',MEDIA,'-map','0:v:0','-f','null','-','-map','0:a:0','-f','null','-']);
pass.push('FULL_AUDIO_VIDEO_DECODE');

const temp=await fs.mkdtemp(path.join(os.tmpdir(),'compass-hybrid-verify-'));
const decoded=path.join(temp,'frame-zero.png');
run('ffmpeg',['-y','-v','error','-i',MEDIA,'-frames:v','1',decoded]);
const decodedSha=createHash('sha256').update(await fs.readFile(decoded)).digest('hex');
check(decodedSha===EXPECTED.posterSha,'POSTER_EXACT_DECODED_FRAME_ZERO');
await fs.rm(temp,{recursive:true,force:true});

const js=await fs.readFile(path.join(ROOT,JS),'utf8');
const html=await fs.readFile(path.join(ROOT,HTML),'utf8');
check(js.includes(EXPECTED.mediaSha)&&js.includes(EXPECTED.posterSha),'PLAYER_IDENTITIES_BOUND');
check(js.includes('ambientVideo.poster=CONTRACT.posterPath')&&js.includes('video.poster=CONTRACT.posterPath'),'POSTER_ASSIGNED_BEFORE_PLAYBACK');
check(js.includes('if(video.readyState===0)video.load()'),'PLAY_DOES_NOT_RESET_A_DECODED_VIDEO');
check(html.includes('rel="preload" as="image"')&&html.includes('cb=47ca784c3f679555'),'POSTER_PRELOADED_IN_HEAD');
check(!/pushState|replaceState|location\.(?:assign|replace)|location\.href\s*=(?!=)/.test(js),'NO_NAVIGATION_WRITES');
check(!/fetch\(|sendBeacon\(|XMLHttpRequest/.test(js),'NO_ANALYTICS_OR_NETWORK_WRITES');
run(process.execPath,['--check',JS]);
pass.push('PLAYER_SYNTAX');

for(const file of [ROOT_MANIFEST,EVIDENCE_MANIFEST]){
  const manifest=JSON.parse(await fs.readFile(path.join(ROOT,file),'utf8'));
  check(manifest.publicationAuthority===false,`${path.basename(path.dirname(file))}_${path.basename(file)}_NO_PUBLICATION_AUTHORITY`);
}

process.stdout.write(`${JSON.stringify({status:'PASS',checks:pass.length,passed:pass},null,2)}\n`);
