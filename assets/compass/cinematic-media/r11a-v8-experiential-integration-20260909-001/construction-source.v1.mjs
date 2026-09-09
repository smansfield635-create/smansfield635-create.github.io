#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const sharpModule=await import(`${process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES}/sharp/dist/index.cjs`);
const sharp=sharpModule.default;
const ROOT=process.cwd();
const SOURCE_MEDIA=path.join(ROOT,'assets/compass/cinematic-media/compass-main-orientation-final-v2.mp4');
const DEST_MEDIA=SOURCE_MEDIA;
const EXPECTED_SOURCE_SHA256='9641cf6653d1317d5b69b0310cfea301723da4ddd4cce8be15d4a7fcde23e919';
const W=1280,H=720,FPS=30;
const SOURCE_FIRST_FRAME=144;
const AUDRALIA_LAST_FRAME=1403;
const CODA_FIRST_FRAME=1404;
const HOUSE_LAST_FRAME=1631;
const AUDRALIA_HOLD_FRAMES=90;
const CODA_SCALE=1.6;
const TERMINAL_PIXEL_FRAMES=60;
const TERMINAL_CLEAR_FRAMES=24;
const PIXEL_COLUMNS=128,PIXEL_ROWS=72;
const PIXEL_W=W/PIXEL_COLUMNS,PIXEL_H=H/PIXEL_ROWS;

const args=new Map();
for(let i=2;i<process.argv.length;i+=2)args.set(process.argv[i],process.argv[i+1]);
const outputDir=path.resolve(args.get('--output')||path.join(os.tmpdir(),'dgb-r11a-v8-render'));
const suppliedFrames=args.get('--source-frames');
const workDir=path.join(outputDir,'work');
const sourceFrames=suppliedFrames?path.resolve(suppliedFrames):path.join(workDir,'source-frames');
const frameDir=path.join(outputDir,'frames');
const videoOnly=path.join(workDir,'video-only.mp4');
const outputMedia=path.join(outputDir,'R11A_full-cinematic_experiential-integration_owner-review_v8.mp4');
const contactSheet=path.join(outputDir,'R11A_full-cinematic_contact_sheet_v8.png');

const run=(command,commandArgs)=>{
  const result=spawnSync(command,commandArgs,{stdio:'inherit'});
  if(result.status!==0)throw new Error(`${command.toUpperCase()}_FAILED:${result.status}`);
};
const sha256=async file=>createHash('sha256').update(await fs.readFile(file)).digest('hex');
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
const smooth=value=>{const x=clamp(value);return x*x*(3-2*x);};
const sourceFrame=index=>path.join(sourceFrames,`frame-${String(index).padStart(4,'0')}.png`);
const outputFrame=index=>path.join(frameDir,`frame-${String(index).padStart(4,'0')}.png`);

await fs.mkdir(workDir,{recursive:true});
await fs.rm(frameDir,{recursive:true,force:true});
await fs.mkdir(frameDir,{recursive:true});

if(await sha256(SOURCE_MEDIA)!==EXPECTED_SOURCE_SHA256)throw new Error('V7_SOURCE_MEDIA_HASH_MISMATCH');
if(!suppliedFrames){
  await fs.mkdir(sourceFrames,{recursive:true});
  run('ffmpeg',['-y','-v','error','-i',SOURCE_MEDIA,'-vsync','0',path.join(sourceFrames,'frame-%04d.png')]);
  // ffmpeg starts at 1; normalize to the zero-based frame names used by the accepted construction record.
  const names=(await fs.readdir(sourceFrames)).filter(name=>/^frame-\d{4}\.png$/.test(name)).sort();
  const normalized=path.join(workDir,'normalized-source-frames');
  await fs.mkdir(normalized,{recursive:true});
  for(let index=0;index<names.length;index++)await fs.rename(path.join(sourceFrames,names[index]),path.join(normalized,`frame-${String(index).padStart(4,'0')}.png`));
  await fs.rm(sourceFrames,{recursive:true,force:true});
  await fs.rename(normalized,sourceFrames);
}

let cursor=0;
for(let sourceIndex=SOURCE_FIRST_FRAME;sourceIndex<=AUDRALIA_LAST_FRAME;sourceIndex++,cursor++){
  await fs.copyFile(sourceFrame(sourceIndex),outputFrame(cursor));
}
const audraliaTerminal=sourceFrame(AUDRALIA_LAST_FRAME);
for(let index=0;index<AUDRALIA_HOLD_FRAMES;index++,cursor++)await fs.copyFile(audraliaTerminal,outputFrame(cursor));

const sourceCodaCount=HOUSE_LAST_FRAME-CODA_FIRST_FRAME+1;
const retimedCodaCount=Math.round(sourceCodaCount*CODA_SCALE);
for(let index=0;index<retimedCodaCount;index++,cursor++){
  const sourcePosition=index*(sourceCodaCount-1)/Math.max(1,retimedCodaCount-1);
  const low=Math.floor(sourcePosition),high=Math.min(sourceCodaCount-1,low+1),mix=sourcePosition-low;
  const lowPath=sourceFrame(CODA_FIRST_FRAME+low),highPath=sourceFrame(CODA_FIRST_FRAME+high);
  if(mix<.015||low===high)await fs.copyFile(lowPath,outputFrame(cursor));
  else if(mix>.985)await fs.copyFile(highPath,outputFrame(cursor));
  else{
    const highBytes=await fs.readFile(highPath);
    await sharp(lowPath).composite([{input:highBytes,blend:'over',opacity:mix}]).png({compressionLevel:5}).toFile(outputFrame(cursor));
  }
}

const houseBytes=await fs.readFile(sourceFrame(HOUSE_LAST_FRAME));
const sampled=await sharp(houseBytes).resize(PIXEL_COLUMNS,PIXEL_ROWS,{fit:'fill',kernel:'nearest'}).ensureAlpha().raw().toBuffer();
function rng(seed){let value=seed>>>0;return()=>{value+=0x6d2b79f5;let result=value;result=Math.imul(result^(result>>>15),result|1);result^=result+Math.imul(result^(result>>>7),result|61);return((result^(result>>>14))>>>0)/4294967296;};}
function terminalParticles(progress){
  const rectangles=[];
  for(let row=0;row<PIXEL_ROWS;row++)for(let column=0;column<PIXEL_COLUMNS;column++){
    const offset=(row*PIXEL_COLUMNS+column)*4,random=rng(0x51de7a11^Math.imul(row+17,2246822519)^Math.imul(column+31,3266489917));
    const noise=random(),x=(column+.5)*PIXEL_W,y=(row+.5)*PIXEL_H;
    const dx0=x-W/2,dy0=y-H/2,length=Math.hypot(dx0,dy0)||1,dx=dx0/length,dy=dy0/length,tangentX=-dy,tangentY=dx;
    const phase=clamp((progress-noise*.24)/.76),alpha=(1-smooth(phase))*sampled[offset+3]/255;
    const luma=sampled[offset]*.2126+sampled[offset+1]*.7152+sampled[offset+2]*.0722;
    if(alpha<.012||(luma<=7&&random()>=.018))continue;
    const distance=28+random()*136,swirl=Math.sin(phase*Math.PI)*distance*(random()-.5)*.92;
    const px=x+dx*distance*phase+tangentX*swirl,py=y+dy*distance*phase+tangentY*swirl,size=Math.max(1.1,PIXEL_W*(1-phase*.86));
    rectangles.push(`<rect x="${(px-size/2).toFixed(2)}" y="${(py-size/2).toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${Math.min(1.1,size*.12).toFixed(2)}" fill="rgb(${sampled[offset]},${sampled[offset+1]},${sampled[offset+2]})" fill-opacity="${alpha.toFixed(3)}"/>`);
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#010407"/>${rectangles.join('')}</svg>`);
}
for(let index=0;index<TERMINAL_PIXEL_FRAMES;index++,cursor++){
  const progress=index/Math.max(1,TERMINAL_PIXEL_FRAMES-1),sourceOpacity=1-smooth(progress/.18);
  const layers=[];
  if(sourceOpacity>.001)layers.push({input:houseBytes,blend:'over',opacity:sourceOpacity});
  layers.push({input:terminalParticles(progress),blend:'over'});
  await sharp({create:{width:W,height:H,channels:4,background:'#010407'}}).composite(layers).png({compressionLevel:5}).toFile(outputFrame(cursor));
}
const clearFrame=await sharp({create:{width:W,height:H,channels:3,background:'#010407'}}).png().toBuffer();
for(let index=0;index<TERMINAL_CLEAR_FRAMES;index++,cursor++)await fs.writeFile(outputFrame(cursor),clearFrame);

const frameCount=cursor,durationSeconds=frameCount/FPS;
run('ffmpeg',['-y','-v','error','-framerate',String(FPS),'-i',path.join(frameDir,'frame-%04d.png'),'-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-profile:v','high','-color_range','tv','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709','-movflags','+faststart',videoOnly]);
const sourceAudioSeconds=56.9-4.8;
const audioTempo=sourceAudioSeconds/durationSeconds;
run('ffmpeg',['-y','-v','error','-i',videoOnly,'-ss','4.8','-i',SOURCE_MEDIA,'-filter_complex',`[1:a]atempo=${audioTempo.toFixed(8)},apad=pad_dur=2[a]`,'-map','0:v:0','-map','[a]','-t',durationSeconds.toFixed(6),'-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-movflags','+faststart',outputMedia]);

const samples=[0,134,269,349,449,546,628,714,816,874,918,984,1044,1104,1164,1224,1284,1344,1396,1464,1578,1687,1754];
const labels=['MATTER','IDENTITY','ORIENTATION','DISCOVERY','DISCOVERY · HELD','RESEARCH','TRL 7','TRA','COMMUNITY','BODIES MOVE','COLORED GLASS FORMS','SIGNATURE WINDOW','WINDOW HELD','CURRENT AUDRALIA REVEALED','CROSSING','AUDRALIA · IMMERSION','AUDRALIA · SETTLED','AUDRALIA · HELD','AUDRALIA PIXELATES','BRAIN · HELD','TROPHY · HELD','HOUSE · HELD','HOUSE DISSOLVES TO LIVE COMPASS'];
const thumbWidth=288,thumbHeight=162,composites=[];
for(let index=0;index<samples.length;index++){
  const sample=Math.min(frameCount-1,samples[index]);
  const buffer=await sharp(outputFrame(sample)).resize(thumbWidth,thumbHeight).toBuffer();
  composites.push({input:buffer,left:24+(index%3)*416,top:66+Math.floor(index/3)*202});
}
const labelsSvg=labels.map((label,index)=>`<text x="${24+(index%3)*416}" y="${55+Math.floor(index/3)*202}" fill="#c2ccca" font-family="Arial" font-size="10" font-weight="800" letter-spacing="1.25">${label}</text>`).join('');
const sheetHeight=60+Math.ceil(samples.length/3)*202;
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="${sheetHeight}"><rect width="1280" height="${sheetHeight}" fill="#010407"/><text x="24" y="29" fill="#e8cb78" font-family="Arial" font-size="16" font-weight="900" letter-spacing="2.8">R11A · ACTUAL SURFACE → FILM → ACTUAL COMPASS · OWNER REVIEW · V8</text>${labelsSvg}</svg>`)).composite(composites).png({compressionLevel:7}).toFile(contactSheet);

const result={
  schema:'R11A_V8_EXPERIENTIAL_INTEGRATION_PREPUBLICATION_RENDER_v1',
  source:{path:path.relative(ROOT,SOURCE_MEDIA),sha256:EXPECTED_SOURCE_SHA256,removedSimulatedEntryFrames:[0,SOURCE_FIRST_FRAME]},
  output:{path:outputMedia,sha256:await sha256(outputMedia),frameCount,durationMs:Math.round(durationSeconds*1000),fps:FPS,width:W,height:H},
  timing:{audraliaHoldFrames:AUDRALIA_HOLD_FRAMES,codaScale:CODA_SCALE,terminalPixelFrames:TERMINAL_PIXEL_FRAMES,terminalClearFrames:TERMINAL_CLEAR_FRAMES,naturalLiveCompassRevealMs:2200},
  invariants:{actualDomInitiatesPlay:true,actualDomInitiatesSkip:true,simulatedEntryCardFrames:0,inventedCompassTerminalFrames:0,terminalSurface:'CANONICAL_LIVE_FOUR_STAR_COMPASS',interactiveDuringFilm:false}
};
await fs.writeFile(path.join(outputDir,'construction-result.v1.json'),`${JSON.stringify(result,null,2)}\n`);
process.stdout.write(`${JSON.stringify(result,null,2)}\n`);

