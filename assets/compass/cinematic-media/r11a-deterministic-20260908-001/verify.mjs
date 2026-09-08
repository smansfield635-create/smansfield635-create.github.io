#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const argv=process.argv.slice(2);
const flag=n=>argv.includes(n);
const arg=n=>{const i=argv.indexOf(n);return i>=0?argv[i+1]:null};
const manifestPath=path.resolve(arg('--manifest')||'manifest.v1.json');
const masterArg=arg('--master');
const masterPath=masterArg?path.resolve(masterArg):null;
const dir=masterPath?path.dirname(masterPath):path.dirname(manifestPath);
const sha256=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const manifestSha=sha256(manifestPath);
const checks=[];
const check=(id,pass,detail=null)=>checks.push({id,pass:Boolean(pass),detail});

const scenes=manifest.scenes||[];
const coverage=scenes.length===10&&scenes[0]?.frameRange?.[0]===0&&scenes.at(-1)?.frameRange?.[1]===1275&&scenes.every((s,i)=>s.frameRange[1]-s.frameRange[0]===s.frameCount&&(i===0||scenes[i-1].frameRange[1]===s.frameRange[0]));
const proofs=scenes.filter(s=>s.treatment==='APPROVED_MOTION_PROOF').map(s=>s.id);
check('GOVERNING_HEAD',manifest.governingHead==='8f97bb035dce439cf28ca156b2fcd5bdfc6a1953',manifest.governingHead);
check('FRAME_INTERVAL_AND_COVERAGE',coverage,'[0,1275) / 1275 frames');
check('SALVAGE_CERTIFICATION',manifest.salvageCertification?.result==='ALL_SCENES_READY_FOR_SOURCE_TRUTH_CONSTRUCTION'&&manifest.salvageCertification?.decisionLostSceneCount===0&&manifest.salvageCertification?.missingSpecificMotionEvidenceSceneCount===0,manifest.salvageCertification||null);
check('NO_RUNTIME_DONOR_DEPENDENCY',manifest.historicalDonorPolicy?.runtimeRequired===false&&manifest.historicalDonorPolicy?.missingContainerBlocksConstruction===false&&scenes.every(s=>s.runtimeDonorRequired===false&&(s.historicalDonorProvenance||[]).every(d=>d.runtimeRequired===false)),null);
check('R5_RUNTIME_PROHIBITED',manifest.constructionInputs?.r5MasterRuntimeInput===false&&manifest.historicalRejectedImplementation?.runtimeUseProhibited===true,manifest.historicalRejectedImplementation||null);
check('MOTION_PROOF_SET',JSON.stringify(proofs)===JSON.stringify(['S00','S04']),proofs);
check('CONTEXT_BOUNDARY',manifest.contextLaw?.contextEndFrame===990&&scenes.filter(s=>s.frameRange[0]>=990).every(s=>(s.context||[]).length===0),990);
check('CANONICAL_SOURCE_IDENTITIES_PRESENT',scenes.every(s=>(s.canonicalSources||[]).length>0&&(s.canonicalSources||[]).every(x=>typeof x.path==='string'&&/^[0-9a-f]{40}$/.test(x.gitBlob))),null);
check('R3_MOTION_AUTHORITY_BOUND',manifest.survivingMotionAuthority?.r3SourceCommit==='1085bfe62239980d412d6e805b10d3203eb632ab'&&manifest.survivingMotionAuthority?.r3CaptureSourceGitBlob==='c08e7a8db3e41d6dee1dbae11c0dd81fe9fd3819'&&manifest.survivingMotionAuthority?.r3SourceManifestGitBlob==='f88ff1367e4978a59e9c8d8e827b2feca8dabca8',manifest.survivingMotionAuthority||null);

if(flag('--manifest-only')||!masterPath){
  const pass=checks.every(c=>c.pass);
  console.log(JSON.stringify({schema:'R11A_SALVAGE_MANIFEST_VERIFICATION_v1',result:pass?'PASS_CLOSED':'FAIL_CLOSED',manifestSha256:manifestSha,checks},null,2));
  process.exit(pass?0:1);
}

const constructionPath=path.join(dir,'construction-receipt.v1.json');
if(!fs.existsSync(constructionPath)){check('CONSTRUCTION_RECEIPT',false,'missing');}
let construction=null;
try{construction=JSON.parse(fs.readFileSync(constructionPath,'utf8'))}catch{}
const masterSha=fs.existsSync(masterPath)?sha256(masterPath):null;
check('MASTER_PRESENT',Boolean(masterSha),masterPath);
if(construction){
  check('MANIFEST_IDENTITY',construction.frozenManifestSha256===manifestSha&&construction.builderInputManifestSha256===manifestSha,{manifestSha,constructionFrozen:construction.frozenManifestSha256,builder:construction.builderInputManifestSha256});
  check('SOURCE_TRUTH_FRAME_MODE',construction.result==='CONSTRUCTION_COMPLETE_SOURCE_TRUTH'&&construction.sourceFrameMode==='LOSSLESS_1280X720_30FPS_SOURCE_TRUTH_FRAMES'&&construction.sourceFrameCount===1275,null);
  check('CONSTRUCTION_NO_DONOR_OR_R5_RUNTIME',construction.historicalDonorRuntimeInput===false&&construction.r5RuntimeInput===false,null);
  check('T10_AUDIO_IDENTITY',construction.audioAuthoritySha1===manifest.audioAuthority?.authoritySha1,construction.audioAuthoritySha1);
  check('DOUBLE_ENCODE_IDENTITY',construction.doubleEncodeBitIdentical===true,null);
  check('MASTER_DIGEST_IDENTITY',masterSha===construction.outputSha256,{masterSha,recorded:construction.outputSha256});
}

if(masterSha){
  const v=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,avg_frame_rate,color_range,color_space,color_transfer,color_primaries,nb_read_frames','-of','json',masterPath],{encoding:'utf8'});
  const a=spawnSync('ffprobe',['-v','error','-select_streams','a:0','-show_entries','stream=codec_name,profile,sample_rate,channels,channel_layout','-of','json',masterPath],{encoding:'utf8'});
  const f=spawnSync('ffprobe',['-v','error','-show_entries','format=duration,size','-of','json',masterPath],{encoding:'utf8'});
  let video=null,audio=null,format=null;
  try{video=JSON.parse(v.stdout).streams?.[0]}catch{}
  try{audio=JSON.parse(a.stdout).streams?.[0]}catch{}
  try{format=JSON.parse(f.stdout).format}catch{}
  check('MASTER_VIDEO_CONTRACT',video?.codec_name==='h264'&&video?.profile==='High'&&video?.width===1280&&video?.height===720&&video?.pix_fmt==='yuv420p'&&video?.r_frame_rate==='30/1'&&video?.avg_frame_rate==='30/1'&&Number(video?.nb_read_frames)===1275,{video});
  check('MASTER_COLOR_CONTRACT',video?.color_range==='tv'&&video?.color_space==='bt709'&&video?.color_transfer==='bt709'&&video?.color_primaries==='bt709',{color_range:video?.color_range,color_space:video?.color_space,color_transfer:video?.color_transfer,color_primaries:video?.color_primaries});
  check('MASTER_AUDIO_CONTRACT',audio?.codec_name==='aac'&&audio?.profile==='LC'&&Number(audio?.sample_rate)===48000&&audio?.channels===2,{audio});
  check('MASTER_DURATION',Math.abs(Number(format?.duration)-42.5)<=0.001,format?.duration);
  const bytes=fs.readFileSync(masterPath);const moov=bytes.indexOf(Buffer.from('moov')),mdat=bytes.indexOf(Buffer.from('mdat'));
  check('MASTER_FASTSTART',moov>=0&&mdat>=0&&moov<mdat,{moov,mdat});
  const decode=spawnSync('ffmpeg',['-hide_banner','-nostdin','-v','error','-i',masterPath,'-f','null','-'],{encoding:'utf8'});
  check('DECODE_ZERO_ERROR',decode.status===0&&!decode.stderr.trim(),decode.stderr.trim()||null);
}

const pass=checks.every(c=>c.pass);
const receipt={schema:'R11A_VERIFICATION_RECEIPT_v1',result:pass?'PASS_CLOSED':'FAIL_CLOSED',operationId:'COMPASS_R11A_DETERMINISTIC_FILM_CONSTRUCTION_20260908_001',governingHead:manifest.governingHead,frozenManifestSha256:manifestSha,verifierInputManifestSha256:manifestSha,masterSha256:masterSha,publicationReady:false,checks,failureDisposition:pass?null:'R11A_SOURCE_TRUTH_REVIEW_MASTER_VERIFICATION_FAILED',nextLawfulState:pass?'OWNER_PERCEPTUAL_REVIEW_BEFORE_SEPARATE_RELEASE_OPERATION':'REPAIR_WITHIN_GEN1997_ONLY'};
fs.writeFileSync(path.join(dir,'verification-receipt.v1.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
process.exit(pass?0:1);
