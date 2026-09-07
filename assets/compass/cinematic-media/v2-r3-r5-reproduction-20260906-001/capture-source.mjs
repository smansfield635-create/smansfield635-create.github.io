import createMapWideEnvironmentRenderer from '/inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';

export const SCHEMA='COMPASS_V2_R3_DETACHED_TIME_ADDRESSABLE_CAPTURE_SOURCE_v1';
export const MASTER_DURATION_MS=38000;
export const AUDRALIA_AUTHORITY='AUDRALIA_AUTHORITY_PACKET_A1';

export const EVENTS=Object.freeze([
  Object.freeze({id:'S01',textIn:250,imageIn:900,textOut:3500,imageOut:4850}),
  Object.freeze({id:'S02',textIn:4500,imageIn:5150,textOut:8550,imageOut:9850}),
  Object.freeze({id:'S03',textIn:9500,imageIn:10150,textOut:13550,imageOut:14850}),
  Object.freeze({id:'S04-A',textIn:14500,imageIn:15050,textOut:16150,imageOut:16850}),
  Object.freeze({id:'S04-B',textIn:16500,imageIn:17050,textOut:18550,imageOut:19850}),
  Object.freeze({id:'S05',textIn:19500,imageIn:20150,textOut:23150,imageOut:24850}),
  Object.freeze({id:'S06',textIn:24500,imageIn:25050,textOut:28050,imageOut:29350}),
  Object.freeze({id:'S07-A',textIn:29000,imageIn:29450,textOut:30550,imageOut:31350}),
  Object.freeze({id:'S07-B',textIn:31000,imageIn:31450,textOut:32550,imageOut:33350}),
  Object.freeze({id:'S07-C',textIn:33000,imageIn:33450,textOut:34550,imageOut:35350}),
  Object.freeze({id:'S08',textIn:35000,imageIn:35400,textOut:37200,imageOut:38000})
]);

const byId=Object.freeze(Object.fromEntries(EVENTS.map(event=>[event.id,event])));
const capture=document.querySelector('#capture');
const status=document.querySelector('#status');
const worldShell=document.querySelector('#audralia-shell');
const worldCanvas=document.querySelector('#audralia-world');
const thresholdCanvas=document.querySelector('#mirrorland-window');
const brainCanvas=document.querySelector('#brain-canvas');
const trophyCanvas=document.querySelector('#trophy-canvas');
const houseCanvas=document.querySelector('#house-canvas');
const textLayers=Object.freeze(Object.fromEntries([...document.querySelectorAll('[data-text]')].map(node=>[node.dataset.text,node])));
const imageLayers=Object.freeze(Object.fromEntries([...document.querySelectorAll('[data-image]')].map(node=>[node.dataset.image,node])));
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const c01=value=>clamp(value,0,1);
const smooth=(a,b,value)=>{const x=c01((value-a)/(b-a||1));return x*x*(3-2*x)};
const mix=(a,b,t)=>a+(b-a)*t;
const opacityFor=(ms,start,end,fade=260)=>c01(smooth(start,start+fade,ms)*(1-smooth(end-fade,end,ms)));
const normalizedMs=value=>Math.round(clamp(Number(value)||0,0,MASTER_DURATION_MS));
const stableRound=value=>Math.round(value*1e6)/1e6;

function timelineState(ms){
  const text={};const image={};
  for(const event of EVENTS){
    text[event.id]=stableRound(opacityFor(ms,event.textIn,event.textOut,220));
    image[event.id]=stableRound(opacityFor(ms,event.imageIn,event.imageOut,300));
  }
  const worldVisible=ms>=byId.S05.imageIn&&ms<byId.S06.imageOut;
  const handoff=stableRound(smooth(byId.S05.imageOut,byId.S06.imageIn,ms));
  return Object.freeze({ms,text:Object.freeze(text),image:Object.freeze(image),worldVisible,handoff});
}

function renderThresholdGeometry(){
  const geometry=globalThis.DGB_MIRRORLAND_WINDOW_GEOMETRY;
  if(!geometry?.ready)throw new Error('R3_MIRRORLAND_GEOMETRY_NOT_READY');
  const ctx=thresholdCanvas.getContext('2d',{alpha:true});
  ctx.clearRect(0,0,480,720);
  ctx.save();
  for(const pane of geometry.getPanes()){
    geometry.tracePolygon(ctx,pane.points);
    ctx.fillStyle=geometry.rgba(pane.color,.24+pane.alpha*.28);
    ctx.fill();
    ctx.strokeStyle='rgba(20,27,38,.94)';
    ctx.lineWidth=4;
    ctx.stroke();
  }
  for(const segment of geometry.getFrameSegments()){
    ctx.beginPath();ctx.moveTo(segment[0][0],segment[0][1]);
    for(let i=1;i<segment.length;i++)ctx.lineTo(segment[i][0],segment[i][1]);
    ctx.strokeStyle='rgba(12,16,24,.98)';ctx.lineWidth=13;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
    ctx.strokeStyle='rgba(104,117,143,.72)';ctx.lineWidth=3;ctx.stroke();
  }
  geometry.traceOuterWindow(ctx);ctx.strokeStyle='rgba(7,10,16,.99)';ctx.lineWidth=18;ctx.stroke();
  geometry.traceInnerWindow(ctx);ctx.strokeStyle='rgba(93,108,137,.78)';ctx.lineWidth=4;ctx.stroke();
  ctx.restore();
}

function thresholdPolygon(){
  const geometry=globalThis.DGB_MIRRORLAND_WINDOW_GEOMETRY;
  const [left,right]=geometry.getFrameSegments();
  const outline=[...left,...[...right].reverse()];
  return `polygon(${outline.map(([x,y])=>`${(x/480*100).toFixed(4)}% ${(y/720*100).toFixed(4)}%`).join(',')})`;
}

const world=createMapWideEnvironmentRenderer(worldCanvas);
world.focusGratitude();
world.render();
renderThresholdGeometry();
const thresholdClip=thresholdPolygon();

const brainApi=globalThis.CompassBrainScene?.mount?.(brainCanvas,{foreground:()=>true})||null;
const trophyApi=globalThis.CompassTrophyScene?.mount?.(trophyCanvas,{foreground:()=>true})||null;
const houseApi=globalThis.CompassHouseScene?.mount?.(houseCanvas,{foreground:()=>true})||null;

function nextPaint(){return new Promise(resolve=>requestAnimationFrame(()=>resolve()))}
async function awaitHouse(){
  for(let i=0;i<240;i++){
    if(houseCanvas.dataset.houseAssetReady==='true')return true;
    if(houseCanvas.dataset.houseAssetReady==='false')throw new Error(`R3_HOUSE_SOURCE_FAILED:${houseCanvas.dataset.houseError||'unknown'}`);
    await nextPaint();
  }
  throw new Error('R3_HOUSE_SOURCE_READY_TIMEOUT');
}
async function awaitDonors(){
  if(brainApi?.load){const ok=await brainApi.load;if(!ok)throw new Error(`R3_BRAIN_SOURCE_FAILED:${brainCanvas.dataset.brainFailure||'unknown'}`)}
  if(trophyApi?.capture&&!trophyApi.capture())throw new Error('R3_TROPHY_SOURCE_FAILED');
  await awaitHouse();
  houseApi?.draw?.();
  return true;
}

function sizeWorld(ms,handoff){
  const viewport=capture.getBoundingClientRect();
  const fullW=Math.max(1,viewport.width),fullH=Math.max(1,viewport.height);
  const thresholdH=Math.min(fullH*.86,680);
  const thresholdW=thresholdH*(480/720);
  const p=c01(handoff);
  const width=mix(thresholdW,fullW,p),height=mix(thresholdH,fullH,p);
  worldShell.style.width=`${width}px`;worldShell.style.height=`${height}px`;
  worldShell.style.left=`${(fullW-width)/2}px`;worldShell.style.top=`${(fullH-height)/2}px`;
  worldShell.style.borderRadius=`${mix(28,0,p)}px`;
  worldShell.style.clipPath=p<.999?thresholdClip:'none';
  worldShell.style.opacity=ms>=byId.S05.imageIn&&ms<byId.S06.imageOut?'1':'0';
  world.render();
}

function apply(msValue){
  const ms=normalizedMs(msValue);const state=timelineState(ms);
  for(const [id,node] of Object.entries(textLayers))node.style.opacity=String(state.text[id]||0);
  for(const [id,node] of Object.entries(imageLayers))node.style.opacity=String(state.image[id]||0);
  thresholdCanvas.style.opacity=String(state.image.S05||0);
  sizeWorld(ms,state.handoff);
  capture.dataset.captureMs=String(ms);
  capture.dataset.audraliaAuthority=AUDRALIA_AUTHORITY;
  capture.dataset.worldInstance='single-persistent-instance';
  status.textContent=`R3 · DETACHED · ${String(ms).padStart(5,'0')}ms`;
  return state;
}

let current=apply(0);
const ready=(async()=>{await awaitDonors();current=apply(0);capture.dataset.captureReady='true';return true})();

function snapshot(){
  const state=timelineState(current.ms);
  const activeText=EVENTS.filter(event=>state.text[event.id]>0).map(event=>event.id);
  const activeImages=EVENTS.filter(event=>state.image[event.id]>0).map(event=>event.id);
  return Object.freeze({
    schema:SCHEMA,
    ready:capture.dataset.captureReady==='true',
    ms:state.ms,
    durationMs:MASTER_DURATION_MS,
    activeText:Object.freeze(activeText),
    activeImages:Object.freeze(activeImages),
    worldVisible:state.worldVisible,
    audraliaAuthority:AUDRALIA_AUTHORITY,
    audraliaWorldInstance:'single-persistent-instance',
    mirrorlandGeometryContract:globalThis.DGB_MIRRORLAND_WINDOW_GEOMETRY?.contract?.id||null,
    brainRenderer:brainCanvas.dataset.brainRenderer||null,
    trophyRenderer:trophyCanvas.dataset.trophyRenderer||null,
    houseRenderer:houseCanvas.dataset.houseRenderer||null,
    liveAuthorityMutation:false
  });
}

function seek(ms){current=apply(ms);return snapshot()}
function inspect(){return snapshot()}

const API=Object.freeze({schema:SCHEMA,durationMs:MASTER_DURATION_MS,events:EVENTS,ready,seek,snapshot,inspect});
Object.defineProperty(globalThis,'CompassV2R3Capture',{value:API,writable:false,configurable:false,enumerable:true});
export default API;
