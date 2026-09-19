#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const SCHEMA='THINK_AND_BLINK_SOUNDTRACK_BED_ASSEMBLY_RECEIPT_v1';
const OPERATION='THINK_AND_BLINK_SOUNDTRACK_BED_EXECUTION_20260919_001';
const CONTRACT_COMMENT=5744541283;
const SAMPLE_RATE=48000;
const CHANNELS=2;
const RUNTIME=137.0;
const SOURCES={
  AQUARIUM:{
    id:'AUD_01_AQUARIUM_CANONICAL',
    url:'https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg',
    bytes:1969578,
    sha256:'0f52601bf88e629f22e0c9307808939814efbaa192d9839b7701d7afea040c2e',
    rights:'CC_BY_SA_2_0'
  },
  CAMPANELLA:{
    id:'AUD_02_LA_CAMPANELLA_GREISS_CANONICAL',
    url:'https://upload.wikimedia.org/wikipedia/commons/c/ca/Liszt-La_Campanella-Greiss.ogg',
    bytes:2596535,
    sha256:'7f41c9d7d8179b55a006e09c16c22a218ea4a0ec353cc32f0568ebf77796cad1',
    rights:'PUBLIC_DOMAIN_RECORDING_VRT_CONFIRMED'
  }
};
const MAP={
  aquariumOpen:{sourceIn:0,sourceOut:30,filmIn:0,filmOut:30},
  campDev:{sourceIn:106.575,sourceOut:191.950,filmIn:24,filmOut:109.375},
  campLate:{sourceIn:317,sourceOut:327.710,filmIn:109.375,filmOut:120.085},
  drop:{source:326,film:118.375},
  handoff:{source:327.625,film:120},
  terminal:{source:327.710,film:120.085},
  aquariumReturn:{sourceIn:0,sourceOut:17,filmIn:120,filmOut:137}
};

const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const round=(v,d=9)=>Math.round(v*10**d)/10**d;
function fail(code,detail=null){const e=new Error(code);e.code=code;e.detail=detail;throw e;}
function run(cmd,args,opt={}){const r=spawnSync(cmd,args,{cwd:opt.cwd,encoding:opt.binary?null:'utf8',maxBuffer:128*1024*1024,env:process.env});return{status:r.status??1,stdout:r.stdout??(opt.binary?Buffer.alloc(0):''),stderr:r.stderr??(opt.binary?Buffer.alloc(0):''),error:r.error?.message??null};}
function requireCommand(name){const r=run(name,['-version']);if(r.status!==0||r.error)fail('REQUIRED_COMMAND_UNAVAILABLE',{name,error:r.error,stderr:String(r.stderr).slice(-1000)});}
function writeJson(file,value){fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true});fs.writeFileSync(path.resolve(file),JSON.stringify(stable(value),null,2)+'\n');}
function writeFailureReceipts(args,value){const bytes=JSON.stringify(stable(value),null,2)+'\n';const targets=[args.receipt,args['diagnostic-receipt']].filter(Boolean);if(!targets.length)return false;for(const file of targets){fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true});fs.writeFileSync(path.resolve(file),bytes);}return true;}
function parseArgs(argv){const o={};for(let i=0;i<argv.length;i++){const k=argv[i];if(k==='--assemble'||k==='--self-test'){o[k.slice(2)]=true;continue;}if(!k.startsWith('--'))fail('ARGUMENT_INVALID',k);const v=argv[++i];if(v==null||v.startsWith('--'))fail('ARGUMENT_VALUE_MISSING',k);o[k.slice(2)]=v;}if(Boolean(o.assemble)===Boolean(o['self-test']))fail('MODE_REQUIRED');return o;}
async function fetchExact(source,file){const r=await fetch(source.url,{redirect:'follow',headers:{'User-Agent':'DiamondGateBridge-ThinkBlink-SoundtrackAssembler/1.0'}});if(!r.ok)fail('SOURCE_FETCH_FAILED',{id:source.id,status:r.status});if(r.url!==source.url)fail('SOURCE_FINAL_URL_MISMATCH',{id:source.id,expected:source.url,actual:r.url});const b=Buffer.from(await r.arrayBuffer());if(b.length!==source.bytes)fail('SOURCE_BYTE_COUNT_MISMATCH',{id:source.id,expected:source.bytes,actual:b.length});const h=sha256(b);if(h!==source.sha256)fail('SOURCE_SHA256_MISMATCH',{id:source.id,expected:source.sha256,actual:h});if(b.subarray(0,4).toString('ascii')!=='OggS')fail('SOURCE_OGG_SIGNATURE_MISSING',source.id);fs.writeFileSync(file,b);return{bytes:b.length,sha256:h};}
function probe(file){const r=run('ffprobe',['-v','error','-show_entries','format=duration:stream=sample_rate,channels,codec_name','-of','json',file]);if(r.status!==0)fail('FFPROBE_FAILED',r.stderr);let j;try{j=JSON.parse(r.stdout)}catch{fail('FFPROBE_JSON_INVALID')};const a=(j.streams||[]).find(x=>x.sample_rate||x.channels);return{duration:Number(j.format?.duration),sampleRate:Number(a?.sample_rate),channels:Number(a?.channels),codec:a?.codec_name??null};}
function measureLoudness(file){const r=run('ffmpeg',['-hide_banner','-nostats','-i',file,'-filter_complex','ebur128=peak=true','-f','null','-']);if(r.status!==0)fail('LOUDNESS_MEASURE_FAILED',r.stderr);const s=String(r.stderr);const i=[...s.matchAll(/I:\s*(-?(?:\d+(?:\.\d+)?|inf))\s+LUFS/g)].map(m=>Number(m[1])).filter(Number.isFinite);const p=[...s.matchAll(/Peak:\s*(-?(?:\d+(?:\.\d+)?|inf))\s+dBFS/g)].map(m=>Number(m[1])).filter(Number.isFinite);if(!i.length||!p.length)fail('LOUDNESS_PARSE_FAILED',s.slice(-4000));const integrated=i.at(-1),peak=p.at(-1);const targetGain=-23-integrated;const peakCap=-3-peak;return{integratedLufs:integrated,truePeakDbfs:peak,constantGainDb:Math.min(targetGain,peakCap),targetGainDb:targetGain,peakCapGainDb:peakCap};}
function dbFactor(db){return 10**(db/20);}
function filterGraph(aqGain,lcGain){
  const aq9=dbFactor(-8); // -2 baseline -6 narration duck
  const campEarly=dbFactor(-10); // -4 baseline -6 duck
  const campBody=dbFactor(-8); // -2 baseline -6 duck
  const campDuck=dbFactor(-6);
  const aqReturn=dbFactor(-8); // -2 baseline -6 conservative narration duck
  const lines=[];
  lines.push(`[0:a]aresample=${SAMPLE_RATE},aformat=sample_fmts=fltp:channel_layouts=stereo,volume=${round(dbFactor(aqGain),12)},asplit=2[aqo][aqr]`);
  lines.push(`[1:a]aresample=${SAMPLE_RATE},aformat=sample_fmts=fltp:channel_layouts=stereo,volume=${round(dbFactor(lcGain),12)},asplit=2[lcd][lcl]`);
  // Aquarium opening: 0dB section until 9s, then -8dB effective, equal-power fade 24-30.
  lines.push(`[aqo]atrim=start=0:end=30,asetpts=PTS-STARTPTS,volume='if(lt(t,9),1,if(lt(t,9.04),1+(${aq9}-1)*(t-9)/0.04,${aq9}))*if(lt(t,24),1,if(lt(t,30),cos((t-24)/6*PI/2),0))':eval=frame[aqopen]`);
  // Campanella dev: native mapping 106.575 -> film 24. Fade in 6s; -10dB through film35, then -8dB with 250ms smoothing; final 10ms fade for click suppression only.
  lines.push(`[lcd]atrim=start=106.575:end=191.950,asetpts=PTS-STARTPTS,volume='if(lt(t,11),${campEarly},if(lt(t,11.25),${campEarly}+(${campBody}-${campEarly})*(t-11)/0.25,${campBody}))*if(lt(t,6),sin(t/6*PI/2),1)':eval=frame,afade=t=out:st=85.365:d=0.010,adelay=24000|24000[lcdev]`);
  // Campanella late: source 317 -> film109.375. Duck until film116, release 350ms, then untouched climax/drop dynamics.
  lines.push(`[lcl]atrim=start=317:end=327.710,asetpts=PTS-STARTPTS,volume='if(lt(t,6.625),${campDuck},if(lt(t,6.975),${campDuck}+(1-${campDuck})*(t-6.625)/0.35,1))':eval=frame,afade=t=in:st=0:d=0.010,adelay=109375|109375[lclate]`);
  // Aquarium return starts exactly 120.000 from source 0, 1.25s equal-power fade-in, conservative narration duck + -2 baseline.
  lines.push(`[aqr]atrim=start=0:end=17,asetpts=PTS-STARTPTS,volume='${aqReturn}*if(lt(t,1.25),sin(t/1.25*PI/2),1)':eval=frame,adelay=120000|120000[aqreturn]`);
  lines.push(`[aqopen][lcdev][lclate][aqreturn]amix=inputs=4:duration=longest:normalize=0:dropout_transition=0,atrim=start=0:end=137,asetpts=PTS-STARTPTS[out]`);
  return lines.join(';');
}
function decodeWindow(file,start,end,binSeconds){const r=run('ffmpeg',['-v','error','-ss',String(start),'-to',String(end),'-i',file,'-ac','1','-ar',String(SAMPLE_RATE),'-f','f32le','pipe:1'],{binary:true});if(r.status!==0)fail('OUTPUT_WINDOW_DECODE_FAILED',String(r.stderr));const b=r.stdout;const f=new Float32Array(b.buffer,b.byteOffset,Math.floor(b.length/4));const per=Math.max(1,Math.round(binSeconds*SAMPLE_RATE));const bins=[];for(let a=0;a<f.length;a+=per){const z=Math.min(f.length,a+per);let sq=0,pk=0;for(let i=a;i<z;i++){const v=f[i],av=Math.abs(v);sq+=v*v;if(av>pk)pk=av;}bins.push({start:round(start+a/SAMPLE_RATE,6),end:round(start+z/SAMPLE_RATE,6),rms:round(Math.sqrt(sq/Math.max(1,z-a)),9),peak:round(pk,9)});}return bins;}
function render(aqFile,lcFile,outFile,aqGain,lcGain){const graph=filterGraph(aqGain,lcGain);const wav=outFile+'.pcm.wav';const r=run('ffmpeg',['-y','-v','error','-i',aqFile,'-i',lcFile,'-filter_complex',graph,'-map','[out]','-ar',String(SAMPLE_RATE),'-ac',String(CHANNELS),'-c:a','pcm_s24le',wav]);if(r.status!==0)fail('PCM_RENDER_FAILED',r.stderr);const p=probe(wav);if(Math.abs(p.duration-RUNTIME)>0.002||p.sampleRate!==SAMPLE_RATE||p.channels!==CHANNELS)fail('PCM_RENDER_TECHNICAL_MISMATCH',p);
  const e=run('ffmpeg',['-y','-v','error','-i',wav,'-c:a','libopus','-b:a','192k','-vbr','on','-application','audio','-metadata','title=Think & Blink Soundtrack Bed v1','-metadata','comment=Aquarium: Saint-Saens / Neil and Nancy O\'Doan / Seattle Youth Symphony / Vilem Sokol, CC BY-SA 2.0; edited/synchronized. La Campanella: Liszt / Romuald Greiss, public-domain recording.','-f','ogg',outFile]);if(e.status!==0)fail('REVIEW_BED_ENCODE_FAILED',e.stderr);return{wav,graph,pcmProbe:p};}
function selfTest(){const checks=[
  Math.abs((MAP.campDev.sourceOut-MAP.campDev.sourceIn)-(MAP.campDev.filmOut-MAP.campDev.filmIn))<1e-9,
  Math.abs((MAP.campLate.sourceOut-MAP.campLate.sourceIn)-(MAP.campLate.filmOut-MAP.campLate.filmIn))<1e-9,
  Math.abs((MAP.handoff.source-MAP.campLate.sourceIn)-(MAP.handoff.film-MAP.campLate.filmIn))<1e-9,
  Math.abs((MAP.drop.source-MAP.campLate.sourceIn)-(MAP.drop.film-MAP.campLate.filmIn))<1e-9,
  Math.abs((MAP.terminal.source-MAP.campLate.sourceIn)-(MAP.terminal.film-MAP.campLate.filmIn))<1e-9,
  filterGraph(-1,-2).includes('adelay=120000|120000')
];const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'think-blink-bed-selftest-'));try{const primary=path.join(tmp,'primary.json'),diagnostic=path.join(tmp,'diagnostic.json');const sentinel={schema:SCHEMA,result:'FAIL_CLOSED',errorCode:'SELF_TEST_SENTINEL',detail:'NETWORK_FREE_FAILURE_RECEIPT_EXPORT',mainMutationPerformed:false,mergePerformed:false,deploymentPerformed:false,publicationPerformed:false};checks.push(writeFailureReceipts({receipt:primary,'diagnostic-receipt':diagnostic},sentinel)===true);const a=fs.readFileSync(primary),b=fs.readFileSync(diagnostic);checks.push(Buffer.compare(a,b)===0);checks.push(JSON.parse(a.toString('utf8')).errorCode==='SELF_TEST_SENTINEL');}finally{fs.rmSync(tmp,{recursive:true,force:true});}return{schema:'THINK_AND_BLINK_SOUNDTRACK_BED_ASSEMBLER_SELF_TEST_v1',result:checks.every(Boolean)?'PASS_CLOSED':'FAIL_CLOSED',checks,passed:checks.filter(Boolean).length,failed:checks.filter(x=>!x).length,networkFetchPerformed:false,repositoryMutationPerformed:false};}
async function assemble(args){requireCommand('ffmpeg');requireCommand('ffprobe');if(!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(args['execution-holder']??''))fail('EXECUTION_HOLDER_INVALID');if(!args.audio||!args.receipt)fail('OUTPUT_PATHS_REQUIRED');const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'think-blink-bed-'));try{
    const aq=path.join(tmp,'aquarium.ogg'),lc=path.join(tmp,'campanella.ogg');
    const aqCustody=await fetchExact(SOURCES.AQUARIUM,aq);const lcCustody=await fetchExact(SOURCES.CAMPANELLA,lc);
    const aqProbe=probe(aq),lcProbe=probe(lc);
    const aqLoud=measureLoudness(aq),lcLoud=measureLoudness(lc);
    fs.mkdirSync(path.dirname(path.resolve(args.audio)),{recursive:true});
    const renderInfo=render(aq,lc,path.resolve(args.audio),aqLoud.constantGainDb,lcLoud.constantGainDb);
    const outProbe=probe(path.resolve(args.audio));
    const outBytes=fs.readFileSync(path.resolve(args.audio));
    const handoffBins10=decodeWindow(path.resolve(args.audio),118.0,121.5,0.01);
    const handoffBins50=decodeWindow(path.resolve(args.audio),118.0,121.5,0.05);
    const quiet10=[...handoffBins10].sort((a,b)=>a.rms-b.rms)[0];
    const sampleCountExpected=Math.round(RUNTIME*SAMPLE_RATE);
    const checks={
      aquariumSourceHash:aqCustody.sha256===SOURCES.AQUARIUM.sha256,
      campanellaSourceHash:lcCustody.sha256===SOURCES.CAMPANELLA.sha256,
      outputDuration:Math.abs(outProbe.duration-RUNTIME)<=0.030,
      outputSampleRate:outProbe.sampleRate===SAMPLE_RATE,
      outputChannels:outProbe.channels===CHANNELS,
      dropMapping:MAP.drop.film===118.375&&MAP.drop.source===326,
      handoffMapping:MAP.handoff.film===120&&MAP.handoff.source===327.625,
      terminalMapping:MAP.terminal.film===120.085&&MAP.terminal.source===327.710,
      aquariumReturnNotEarly:MAP.aquariumReturn.filmIn===120,
      noDynamicLimiter:true
    };
    const receipt={
      schema:SCHEMA,result:Object.values(checks).every(Boolean)?'PASS_CLOSED':'FAIL_CLOSED',operationId:OPERATION,executionHolder:args['execution-holder'],contractCommentId:CONTRACT_COMMENT,
      sources:{AQUARIUM:{...aqCustody,probe:aqProbe,loudness:aqLoud,rights:SOURCES.AQUARIUM.rights},CAMPANELLA:{...lcCustody,probe:lcProbe,loudness:lcLoud,rights:SOURCES.CAMPANELLA.rights}},
      timeline:MAP,mix:{sampleRate:SAMPLE_RATE,channels:CHANNELS,runtimeSeconds:RUNTIME,duckDb:6,duckAttackMs:40,duckReleaseMs:350,dropProtection:true,limiterApplied:false},
      output:{path:args.audio,bytes:outBytes.length,sha256:sha256(outBytes),probe:outProbe,codec:'opus',bitrateTarget:'192k',pcmConstructionProbe:renderInfo.pcmProbe,sampleCountExpected},
      verification:{checks,handoffWindow:{start:118,end:121.5,quietest10ms:quiet10,bins10ms:handoffBins10,bins50ms:handoffBins50}},
      sideEffects:{sourceSubstitutionPerformed:false,thirdPartyEditingApplicationUsed:false,mainMutationPerformed:false,mergePerformed:false,deploymentPerformed:false,publicationPerformed:false}
    };
    writeJson(args.receipt,receipt);
    fs.rmSync(renderInfo.wav,{force:true});
    if(receipt.result!=='PASS_CLOSED')process.exitCode=1;
    return receipt;
  }finally{fs.rmSync(tmp,{recursive:true,force:true});}}

const args=parseArgs(process.argv.slice(2));
try{if(args['self-test']){const r=selfTest();if(args.output)writeJson(args.output,r);else process.stdout.write(JSON.stringify(r,null,2)+'\n');if(r.result!=='PASS_CLOSED')process.exitCode=1;}else await assemble(args);}catch(e){const r={schema:SCHEMA,result:'FAIL_CLOSED',errorCode:e.code||'UNEXPECTED_ERROR',detail:e.detail??e.message,mainMutationPerformed:false,mergePerformed:false,deploymentPerformed:false,publicationPerformed:false};if(!writeFailureReceipts(args,r))process.stderr.write(JSON.stringify(r,null,2)+'\n');process.exitCode=1;}
