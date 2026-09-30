#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const die=(m,c=1)=>{console.error(m);process.exit(c)};
const arg=(n)=>{const i=process.argv.indexOf(n);return i>=0?process.argv[i+1]:null};
const run=(cmd,args,opts={})=>{const r=spawnSync(cmd,args,{encoding:'utf8',stdio:opts.stdio??'pipe',...opts});if(r.status!==0)throw new Error(`${cmd} failed (${r.status}): ${r.stderr||r.stdout}`);return r};
const sha256=(b)=>crypto.createHash('sha256').update(b).digest('hex');
const gitBlob=(b)=>crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex');
const safeId=(s)=>String(s).replace(/[^A-Za-z0-9_.-]/g,'_');
const close=(a,b,t=1e-6)=>Math.abs(a-b)<=t;

async function downloadGithub(source,out){
  if(source.kind!=='GITHUB_RAW') throw new Error(`UNSUPPORTED_SOURCE_KIND:${source.kind}`);
  if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(source.repository)) throw new Error('SOURCE_REPOSITORY_INVALID');
  if(!source.ref||!source.path||source.path.startsWith('/')||source.path.split('/').includes('..')) throw new Error('SOURCE_LOCATOR_INVALID');
  const url=`https://raw.githubusercontent.com/${source.repository}/${source.ref}/${source.path}`;
  const headers={'User-Agent':'diamond-gate-video-conform-v1'};
  if(process.env.GITHUB_TOKEN) headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
  const res=await fetch(url,{headers,redirect:'follow'});
  if(!res.ok) throw new Error(`SOURCE_FETCH_FAILURE:${source.sourceId}:${res.status}`);
  const bytes=Buffer.from(await res.arrayBuffer());
  if(source.expectedGitBlob&&gitBlob(bytes)!==source.expectedGitBlob) throw new Error(`SOURCE_BLOB_MISMATCH:${source.sourceId}`);
  if(source.expectedSha256&&sha256(bytes)!==source.expectedSha256) throw new Error(`SOURCE_SHA256_MISMATCH:${source.sourceId}`);
  fs.writeFileSync(out,bytes);
  return {sourceId:source.sourceId,bytes:bytes.length,gitBlob:gitBlob(bytes),sha256:sha256(bytes),locator:{repository:source.repository,ref:source.ref,path:source.path}};
}

function validate(req,registry){
  if(req.schema!=='VIDEO_CONFORM_REQUEST_v1') throw new Error('REQUEST_SCHEMA_INVALID');
  const o=req.output??{};
  for(const k of ['durationSeconds','fps','width','height']) if(!(Number(o[k])>0)) throw new Error(`OUTPUT_${k}_INVALID`);
  if(!Array.isArray(req.segments)||req.segments.length<1) throw new Error('SEGMENTS_REQUIRED');
  const sourceMap=new Map(registry.sources.map(s=>[s.sourceId,s]));
  let cursor=0;
  for(const [i,s] of req.segments.entries()){
    if(!sourceMap.has(s.sourceId)) throw new Error(`UNREGISTERED_SOURCE:${s.sourceId}`);
    for(const k of ['sourceStart','sourceEnd','targetStart','targetEnd']) if(!Number.isFinite(Number(s[k]))) throw new Error(`SEGMENT_NUMERIC_INVALID:${i}:${k}`);
    if(!(s.sourceEnd>s.sourceStart&&s.targetEnd>s.targetStart)) throw new Error(`SEGMENT_RANGE_INVALID:${i}`);
    if(!close(s.targetStart,cursor)) throw new Error(s.targetStart>cursor?`TIMELINE_GAP:${i}`:`TIMELINE_OVERLAP:${i}`);
    cursor=s.targetEnd;
    if(!['contain','cover'].includes(s.fit??'contain')) throw new Error(`SEGMENT_FIT_INVALID:${i}`);
  }
  if(!close(cursor,o.durationSeconds)) throw new Error('TIMELINE_DOES_NOT_COVER_OUTPUT');
  if(req.audio?.mode==='COPY_WHOLE_SOURCE'&&!sourceMap.has(req.audio.sourceId)) throw new Error('AUDIO_SOURCE_UNREGISTERED');
  return sourceMap;
}

function render(req,files,outDir){
  const o=req.output;
  const ids=[...new Set([...req.segments.map(s=>s.sourceId),...(req.audio?.sourceId?[req.audio.sourceId]:[])])];
  const index=new Map(ids.map((id,i)=>[id,i]));
  const args=[]; for(const id of ids) args.push('-i',files.get(id));
  const filters=[];
  req.segments.forEach((s,i)=>{
    const srcDur=s.sourceEnd-s.sourceStart, dstDur=s.targetEnd-s.targetStart, factor=dstDur/srcDur;
    let geom;
    if((s.fit??'contain')==='cover') geom=`scale=${o.width}:${o.height}:force_original_aspect_ratio=increase,crop=${o.width}:${o.height}`;
    else geom=`scale=${o.width}:${o.height}:force_original_aspect_ratio=decrease,pad=${o.width}:${o.height}:(ow-iw)/2:(oh-ih)/2:black`;
    filters.push(`[${index.get(s.sourceId)}:v]trim=start=${s.sourceStart}:end=${s.sourceEnd},setpts=(PTS-STARTPTS)*${factor.toFixed(12)},${geom},fps=${o.fps},format=yuv420p[v${i}]`);
  });
  filters.push(`${req.segments.map((_,i)=>`[v${i}]`).join('')}concat=n=${req.segments.length}:v=1:a=0,format=yuv420p[vout]`);
  const finalName=safeId(o.filename||'video-conform-final.mp4');
  const finalPath=path.join(outDir,finalName.endsWith('.mp4')?finalName:`${finalName}.mp4`);
  args.push('-filter_complex',filters.join(';'),'-map','[vout]');
  if(req.audio?.mode==='COPY_WHOLE_SOURCE') args.push('-map',`${index.get(req.audio.sourceId)}:a:0`);
  args.push('-c:v','libx264','-preset',o.preset||'slow','-crf',String(o.crf??16),'-pix_fmt','yuv420p','-profile:v','high','-movflags','+faststart');
  if(req.audio?.mode==='COPY_WHOLE_SOURCE') args.push('-c:a','copy'); else args.push('-an');
  args.push('-t',String(o.durationSeconds),finalPath);
  run('ffmpeg',['-y',...args]);
  return finalPath;
}

function qualify(req,finalPath){
  const p=run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',finalPath]);
  const probe=JSON.parse(p.stdout), v=probe.streams.find(s=>s.codec_type==='video');
  if(!v) throw new Error('OUTPUT_VIDEO_STREAM_MISSING');
  const duration=Number(probe.format.duration), expectedFrames=Math.round(req.output.durationSeconds*req.output.fps), frames=Number(v.nb_frames||0);
  if(Math.abs(duration-req.output.durationSeconds)>(1/req.output.fps)) throw new Error('OUTPUT_DURATION_MISMATCH');
  if(frames&&frames!==expectedFrames) throw new Error(`OUTPUT_FRAME_COUNT_MISMATCH:${frames}:${expectedFrames}`);
  const dec=spawnSync('ffmpeg',['-v','error','-i',finalPath,'-f','null','-'],{encoding:'utf8'});
  if(dec.status!==0||String(dec.stderr||'').trim()) throw new Error(`DECODE_FAILURE:${dec.stderr||''}`);
  const b=fs.readFileSync(finalPath);
  return {durationSeconds:duration,expectedFrames,frames:frames||null,width:Number(v.width),height:Number(v.height),fps:v.avg_frame_rate,codec:v.codec_name,profile:v.profile,sha256:sha256(b),bytes:b.length,decodeErrors:0};
}

function makeProxy(finalPath,outDir){
  const p=path.join(outDir,'inspection-proxy.mp4');
  run('ffmpeg',['-y','-i',finalPath,'-vf','scale=960:-2','-c:v','libx264','-preset','veryfast','-crf','29','-an','-movflags','+faststart',p]);
  const sheet=path.join(outDir,'contact-sheet.jpg');
  run('ffmpeg',['-y','-i',finalPath,'-vf','fps=1/5,scale=320:-1,tile=4x4:padding=4:margin=4','-frames:v','1',sheet]);
  return {proxy:path.basename(p),contactSheet:path.basename(sheet)};
}

async function selfTest(){
  const d=fs.mkdtempSync(path.join(os.tmpdir(),'video-conform-selftest-'));
  const a=path.join(d,'a.mp4'),b=path.join(d,'b.mp4');
  run('ffmpeg',['-y','-f','lavfi','-i','color=c=black:s=640x360:d=1:r=24','-c:v','libx264','-pix_fmt','yuv420p',a]);
  run('ffmpeg',['-y','-f','lavfi','-i','color=c=white:s=640x360:d=1:r=24','-c:v','libx264','-pix_fmt','yuv420p',b]);
  const req={schema:'VIDEO_CONFORM_REQUEST_v1',requestId:'SELF_TEST',output:{filename:'self-test.mp4',durationSeconds:2,fps:24,width:640,height:360,crf:28,preset:'ultrafast'},segments:[{sourceId:'A',sourceStart:0,sourceEnd:1,targetStart:0,targetEnd:1,fit:'contain'},{sourceId:'B',sourceStart:0,sourceEnd:1,targetStart:1,targetEnd:2,fit:'contain'}]};
  validate(req,{sources:[{sourceId:'A'},{sourceId:'B'}]});
  const files=new Map([['A',a],['B',b]]), final=render(req,files,d), q=qualify(req,final);
  console.log(JSON.stringify({schema:'VIDEO_CONFORM_RENDERER_SELF_TEST_RECEIPT_v1',result:'PASS',qualification:q},null,2));
}

if(process.argv.includes('--self-test')) await selfTest();
else {
  const requestPath=arg('--request'), registryPath=arg('--registry'), outDir=arg('--output-dir'), receiptPath=arg('--receipt');
  if(!requestPath||!registryPath||!outDir||!receiptPath) die('usage: --request <json> --registry <json> --output-dir <dir> --receipt <json>');
  fs.mkdirSync(outDir,{recursive:true});
  const req=JSON.parse(fs.readFileSync(requestPath,'utf8')), registry=JSON.parse(fs.readFileSync(registryPath,'utf8'));
  if(registry.schema!=='REMOTE_VIDEO_SOURCE_REGISTRY_v1') die('SOURCE_REGISTRY_SCHEMA_INVALID');
  const sourceMap=validate(req,registry), needed=[...new Set([...req.segments.map(s=>s.sourceId),...(req.audio?.sourceId?[req.audio.sourceId]:[])])];
  const files=new Map(), custody=[];
  try{
    for(const id of needed){const src=sourceMap.get(id), p=path.join(outDir,`${safeId(id)}.source`);custody.push(await downloadGithub(src,p));files.set(id,p)}
    const final=render(req,files,outDir), qualification=qualify(req,final), inspection=makeProxy(final,outDir);
    const receipt={schema:'VIDEO_CONFORM_RENDER_RECEIPT_v1',result:'PASS_CLOSED',requestId:req.requestId,output:path.basename(final),custody,qualification,inspection,repositoryWritesPerformed:false,productMutationPerformed:false,mergeAuthorityCreated:false,deploymentAuthorityCreated:false,ownerAcceptanceCreated:false};
    fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n'); console.log(JSON.stringify(receipt));
  }catch(e){const receipt={schema:'VIDEO_CONFORM_RENDER_RECEIPT_v1',result:'FAIL_CLOSED',requestId:req.requestId,error:String(e?.message||e),repositoryWritesPerformed:false,productMutationPerformed:false,mergeAuthorityCreated:false,deploymentAuthorityCreated:false,ownerAcceptanceCreated:false};fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');console.error(JSON.stringify(receipt));process.exit(1)}
}
