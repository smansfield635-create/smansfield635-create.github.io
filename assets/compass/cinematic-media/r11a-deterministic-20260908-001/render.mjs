#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const argv=process.argv.slice(2);
const arg=(name,def=null)=>{const i=argv.indexOf(name);return i>=0?argv[i+1]:def};
const manifestPath=path.resolve(arg('--manifest','manifest.v1.json'));
const sourcePath=path.resolve(arg('--source',process.env.R11A_SOURCE||''));
const outputPath=path.resolve(arg('--output','compass-main-orientation-r11a-review.mp4'));
if(!sourcePath||!fs.existsSync(sourcePath)) throw new Error('R11A_SOURCE_MISSING');
const manifestBytes=fs.readFileSync(manifestPath);
const manifest=JSON.parse(manifestBytes);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifestSha=sha(manifestBytes);
const sourceSha=sha(fs.readFileSync(sourcePath));
if(sourceSha!==manifest.materializedCanonicalOccurrence.videoSha256) throw new Error(`R11A_SOURCE_SHA_MISMATCH:${sourceSha}`);
if(manifest.scenes.reduce((n,s)=>n+s.frameCount,0)!==1275) throw new Error('R11A_FRAME_SUM_MISMATCH');
for(let i=0;i<manifest.scenes.length;i++){
  const s=manifest.scenes[i];
  if(s.frameRange[1]-s.frameRange[0]!==s.frameCount) throw new Error(`R11A_RANGE_COUNT_MISMATCH:${s.id}`);
  if(i && manifest.scenes[i-1].frameRange[1]!==s.frameRange[0]) throw new Error(`R11A_RANGE_GAP_OVERLAP:${s.id}`);
}
const esc=t=>String(t).replaceAll('\\','\\\\').replaceAll(':','\\:').replaceAll("'","\\'");
const font='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf';
const filters=[];
filters.push(`[0:v]split=${manifest.scenes.length}${manifest.scenes.map((_,i)=>`[s${i}]`).join('')}`);
manifest.scenes.forEach((s,i)=>{
  const a=s.sourceOccurrence.startSec, b=s.sourceOccurrence.endSec;
  const sourceDur=b-a, target=s.durationSeconds, scale=target/sourceDur;
  let chain=`[s${i}]trim=start=${a}:end=${b},setpts=(PTS-STARTPTS)*${scale.toFixed(12)},fps=30,trim=duration=${target},setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos`;
  if(s.id==='S00'){
    chain+=`,pixelize=w=18:h=18:mode=avg:enable='gte(t,3.45)',shufflepixels=mode=block:w=24:h=18:seed=1100:enable='gte(t,3.75)',fade=t=out:st=4.10:d=0.70`;
  }
  if(s.id!=='LIVE') chain+=`,drawbox=x=0:y=500:w=iw:h=220:color=black@1.0:t=fill`;
  if(s.id==='S00'){
    chain+=`,drawtext=fontfile=${font}:text='${esc(s.context[0])}':fontsize=44:fontcolor=0xfff5d7:x=(w-text_w)/2:y=h-135:enable='between(t,.30,2.10)'`;
    chain+=`,drawtext=fontfile=${font}:text='${esc(s.context[1])}':fontsize=50:fontcolor=0xfff5d7:x=(w-text_w)/2:y=h-135:enable='between(t,2.15,4.05)'`;
  } else if(s.context?.length){
    const text=s.context[0]; const size=text.length>44?34:42;
    chain+=`,drawtext=fontfile=${font}:text='${esc(text)}':fontsize=${size}:fontcolor=0xfff5d7:x=(w-text_w)/2:y=h-125`;
  }
  if(s.id==='LIVE') chain+=`,fade=t=in:st=0:d=0.25`;
  chain+=`[v${i}]`;
  filters.push(chain);
});
filters.push(`${manifest.scenes.map((_,i)=>`[v${i}]`).join('')}concat=n=${manifest.scenes.length}:v=1:a=0,format=yuv420p[outv]`);
const filterFile=path.join(path.dirname(outputPath),'.r11a-filter.txt');
fs.writeFileSync(filterFile,filters.join(';\n')+'\n');
const args=['-y','-hide_banner','-loglevel','error','-i',sourcePath,'-filter_complex_script',filterFile,'-map','[outv]','-frames:v','1275','-r','30','-c:v','libx264','-profile:v','high','-pix_fmt','yuv420p','-crf','25','-preset','slow','-movflags','+faststart',outputPath];
const run=spawnSync('ffmpeg',args,{stdio:'inherit'});
if(run.status!==0) process.exit(run.status??1);
const receipt={schema:'R11A_CONSTRUCTION_RECEIPT_v1',result:'CONSTRUCTION_COMPLETE',operationId:'COMPASS_R11A_DETERMINISTIC_FILM_CONSTRUCTION_20260908_001',governingHead:manifest.governingHead,frozenManifestSha256:manifestSha,builderInputManifestSha256:manifestSha,sourceOccurrenceSha256:sourceSha,sourceArtifactId:manifest.materializedCanonicalOccurrence.artifactId,renderedFrameCount:1275,frameRate:30,durationSeconds:42.5,outputPath:path.basename(outputPath),outputSha256:sha(fs.readFileSync(outputPath)),builderVerifierInvariant:manifest.builderVerifierInvariant};
fs.writeFileSync(path.join(path.dirname(outputPath),'construction-receipt.v1.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
