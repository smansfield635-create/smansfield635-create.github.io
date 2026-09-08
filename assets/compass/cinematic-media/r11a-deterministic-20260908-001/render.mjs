#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const argv=process.argv.slice(2);
const flag=name=>argv.includes(name);
const arg=(name,def=null)=>{const i=argv.indexOf(name);return i>=0?argv[i+1]:def};
const manifestPath=path.resolve(arg('--manifest','manifest.v1.json'));
const framesDir=arg('--frames-dir')?path.resolve(arg('--frames-dir')):null;
const audioPath=arg('--audio')?path.resolve(arg('--audio')):null;
const outputPath=path.resolve(arg('--output','compass-main-orientation-r11a-review.mp4'));
const sha256Bytes=b=>crypto.createHash('sha256').update(b).digest('hex');
const sha256File=p=>sha256Bytes(fs.readFileSync(p));
const sha1File=p=>crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex');
const manifestBytes=fs.readFileSync(manifestPath);
const manifest=JSON.parse(manifestBytes);
const manifestSha=sha256Bytes(manifestBytes);

function fail(code,detail=''){throw new Error(detail?`${code}:${detail}`:code)}
function validateManifest(){
  if(manifest.governingHead!=='8f97bb035dce439cf28ca156b2fcd5bdfc6a1953')fail('R11A_GOVERNING_HEAD_MISMATCH');
  if(manifest.productionLaw!=='APPROVED_SHOT_AUTHORITY + CANONICAL_VISIBLE_ASSET_AUTHORITY -> FINAL_SHOT')fail('R11A_PRODUCTION_LAW_MISMATCH');
  if(manifest.constructionInputs?.r5MasterRuntimeInput!==false||manifest.historicalRejectedImplementation?.runtimeUseProhibited!==true)fail('R11A_R5_RUNTIME_NOT_PROHIBITED');
  if(manifest.historicalDonorPolicy?.runtimeRequired!==false||manifest.historicalDonorPolicy?.missingContainerBlocksConstruction!==false)fail('R11A_DONOR_POLICY_INVALID');
  const scenes=manifest.scenes||[];
  if(scenes.length!==10||scenes[0]?.frameRange?.[0]!==0||scenes.at(-1)?.frameRange?.[1]!==1275)fail('R11A_SCENE_COVERAGE_INVALID');
  let total=0;
  for(let i=0;i<scenes.length;i++){
    const s=scenes[i];
    if(s.salvageStatus!=='READY_FOR_SOURCE_TRUTH_CONSTRUCTION'||s.runtimeDonorRequired!==false)fail('R11A_SCENE_NOT_SALVAGE_READY',s.id);
    if(s.frameRange[1]-s.frameRange[0]!==s.frameCount)fail('R11A_RANGE_COUNT_MISMATCH',s.id);
    if(i&&scenes[i-1].frameRange[1]!==s.frameRange[0])fail('R11A_RANGE_GAP_OVERLAP',s.id);
    if((s.historicalDonorProvenance||[]).some(x=>x.runtimeRequired!==false))fail('R11A_RUNTIME_DONOR_REFERENCE',s.id);
    total+=s.frameCount;
  }
  if(total!==1275)fail('R11A_FRAME_SUM_MISMATCH',String(total));
  const proofs=scenes.filter(s=>s.treatment==='APPROVED_MOTION_PROOF').map(s=>s.id);
  if(JSON.stringify(proofs)!==JSON.stringify(['S00','S04']))fail('R11A_MOTION_PROOF_SET_MISMATCH',JSON.stringify(proofs));
  if(manifest.contextLaw?.contextEndFrame!==990||scenes.filter(s=>s.frameRange[0]>=990).some(s=>(s.context||[]).length))fail('R11A_CONTEXT_BOUNDARY_FAILURE');
  if(manifest.salvageCertification?.decisionLostSceneCount!==0||manifest.salvageCertification?.missingSpecificMotionEvidenceSceneCount!==0)fail('R11A_SALVAGE_CERTIFICATION_INCOMPLETE');
  return true;
}
validateManifest();

if(flag('--certify-only')){
  console.log(JSON.stringify({schema:'R11A_SOURCE_TRUTH_BUILD_ADMISSION_v1',result:'READY_FOR_SOURCE_TRUTH_FRAME_CAPTURE',operationId:'COMPASS_R11A_DETERMINISTIC_FILM_CONSTRUCTION_20260908_001',governingHead:manifest.governingHead,manifestSha256:manifestSha,sceneCount:manifest.scenes.length,renderedFrameCount:1275,historicalDonorRuntimeInput:false,r5RuntimeInput:false},null,2));
  process.exit(0);
}

if(!framesDir||!fs.existsSync(framesDir))fail('R11A_SOURCE_TRUTH_FRAMES_DIR_MISSING');
if(!audioPath||!fs.existsSync(audioPath))fail('R11A_T10_AUDIO_MISSING');
const expectedFrames=Array.from({length:1275},(_,i)=>`frame-${String(i).padStart(6,'0')}.png`);
const actualFrames=fs.readdirSync(framesDir).filter(n=>/^frame-\d{6}\.png$/.test(n)).sort();
if(actualFrames.length!==1275)fail('R11A_SOURCE_TRUTH_FRAME_COUNT',String(actualFrames.length));
for(let i=0;i<expectedFrames.length;i++)if(actualFrames[i]!==expectedFrames[i]||!fs.statSync(path.join(framesDir,expectedFrames[i])).size)fail('R11A_SOURCE_TRUTH_FRAME_SEQUENCE',String(i));
if(fs.statSync(audioPath).size!==manifest.audioAuthority.authorityBytes)fail('R11A_AUDIO_BYTES_MISMATCH',String(fs.statSync(audioPath).size));
const audioSha1=sha1File(audioPath);
if(audioSha1!==manifest.audioAuthority.authoritySha1)fail('R11A_AUDIO_SHA1_MISMATCH',audioSha1);

const firstFrame=path.join(framesDir,'frame-000000.png');
const probe=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0:s=x',firstFrame],{encoding:'utf8'});
if(probe.status!==0||probe.stdout.trim()!=='1280x720')fail('R11A_SOURCE_TRUTH_FRAME_GEOMETRY',probe.stdout.trim());

fs.mkdirSync(path.dirname(outputPath),{recursive:true});
const tmpA=`${outputPath}.encode-a.mp4`,tmpB=`${outputPath}.encode-b.mp4`;
function encode(out){
  const args=['-hide_banner','-nostdin','-loglevel','error','-y','-fflags','+bitexact','-framerate','30','-start_number','0','-i',path.join(framesDir,'frame-%06d.png'),'-i',audioPath,'-t','42.5','-map','0:v:0','-map','1:a:0','-vf','scale=1280:720:in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-profile:v','high','-level:v','4.0','-preset','medium','-crf','18','-pix_fmt','yuv420p','-r','30','-fps_mode','cfr','-threads:v','1','-x264-params','threads=1:lookahead_threads=1:sliced_threads=0:sync-lookahead=0','-flags:v','+bitexact','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-threads:a','1','-flags:a','+bitexact','-map_metadata','-1','-map_chapters','-1','-metadata','creation_time=1970-01-01T00:00:00Z','-movflags','+faststart',out];
  const r=spawnSync('ffmpeg',args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);
}
encode(tmpA);encode(tmpB);
const a=fs.readFileSync(tmpA),b=fs.readFileSync(tmpB);
if(sha256Bytes(a)!==sha256Bytes(b)||!a.equals(b))fail('R11A_DOUBLE_ENCODE_NOT_BIT_IDENTICAL');
fs.renameSync(tmpA,outputPath);fs.rmSync(tmpB,{force:true});
const masterSha=sha256File(outputPath);
const receipt={schema:'R11A_CONSTRUCTION_RECEIPT_v1',result:'CONSTRUCTION_COMPLETE_SOURCE_TRUTH',operationId:'COMPASS_R11A_DETERMINISTIC_FILM_CONSTRUCTION_20260908_001',governingHead:manifest.governingHead,frozenManifestSha256:manifestSha,builderInputManifestSha256:manifestSha,sourceFrameMode:'LOSSLESS_1280X720_30FPS_SOURCE_TRUTH_FRAMES',sourceFrameCount:1275,historicalDonorRuntimeInput:false,r5RuntimeInput:false,audioAuthoritySha1:audioSha1,renderedFrameCount:1275,frameRate:30,durationSeconds:42.5,outputPath:path.basename(outputPath),outputSha256:masterSha,doubleEncodeBitIdentical:true,builderVerifierInvariant:manifest.builderVerifierInvariant};
fs.writeFileSync(path.join(path.dirname(outputPath),'construction-receipt.v1.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
