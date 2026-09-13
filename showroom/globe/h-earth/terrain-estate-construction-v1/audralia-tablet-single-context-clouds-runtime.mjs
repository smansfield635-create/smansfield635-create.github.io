import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
import {createAudraliaTabletCloudPass} from './audralia-tablet-cloud-pass.mjs';

const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode=document.querySelector('[data-h-earth-status]');
const loader=document.querySelector('[data-audralia-loader]');
const loaderStage=document.querySelector('[data-audralia-loader-stage]');
const focusButton=document.querySelector('[data-fit-world]');
const PLANET_RADIUS=6200;
const PLANET_CENTER=Object.freeze([0,-PLANET_RADIUS,0]);
const LOCAL_CENTER_Z=-128;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const setStatus=(text,state=text)=>{if(statusNode){statusNode.textContent=text;statusNode.dataset.status=state;}};
const nextPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

function tangentDirection(u,v){
  const radius=Math.hypot(u,v);
  if(radius<1e-9)return[0,1,0];
  const angle=radius/PLANET_RADIUS,sine=Math.sin(angle),cosine=Math.cos(angle);
  return norm([sine*u/radius,cosine,sine*v/radius]);
}
function tangentPosition(u,v,elevation=0){
  const direction=tangentDirection(u,v),radius=PLANET_RADIUS+elevation;
  return[
    PLANET_CENTER[0]+direction[0]*radius,
    PLANET_CENTER[1]+direction[1]*radius,
    PLANET_CENTER[2]+direction[2]*radius
  ];
}
function normalizedLocalElevation(raw){
  const delta=raw-HYDRO.seaLevelY;
  if(delta<=22)return raw;
  const t=clamp((delta-22)/(76-22),0,1),s=t*t*(3-2*t);
  return HYDRO.seaLevelY+delta*(1+(0.60-1)*s);
}
function sampleCanonicalSurface(u,v){
  const z=v+LOCAL_CENTER_Z,terrain=sampleTerrain(u,z);
  if(terrain?.valid!==true)return Object.freeze({valid:false,u,v,z,elevation:HYDRO.seaLevelY,inside:false});
  const shoreline=resolveHEarthMapWideShorelineZ(u),inside=z<=shoreline;
  const elevation=inside?normalizedLocalElevation(terrain.presentationElevation):HYDRO.seaLevelY;
  return Object.freeze({valid:true,u,v,z,elevation,inside,terrain});
}
function cameraFrame(renderer){
  const snapshot=renderer.getSnapshot();
  const pitch=clamp(snapshot.pitch,.46,1.49),distance=clamp(snapshot.distance,95,5600),yaw=snapshot.yaw;
  const targetU=snapshot.targetU,targetV=snapshot.targetV,direction=tangentDirection(targetU,targetV);
  const groundSample=sampleCanonicalSurface(targetU,targetV),ground=groundSample.inside?groundSample.elevation:HYDRO.seaLevelY;
  const target=tangentPosition(targetU,targetV,ground);
  const pU1=tangentPosition(targetU+1,targetV),pU0=tangentPosition(targetU-1,targetV);
  const pV1=tangentPosition(targetU,targetV+1),pV0=tangentPosition(targetU,targetV-1);
  const eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0));
  const horizontal=norm(add(scale(eU,Math.sin(yaw)),scale(eV,Math.cos(yaw))));
  const eye=add(add(target,scale(direction,distance*Math.sin(pitch)+18)),scale(horizontal,distance*Math.cos(pitch)));
  const forward=norm(sub(target,eye)),right=norm(cross(forward,direction)),up=norm(cross(right,forward));
  return Object.freeze({eye,target,forward,right,up,snapshot,groundSample});
}

function constructPrimaryRenderer(rendererModule){
  const originalGetContext=canvas.getContext;
  let primaryGl=null;
  let webgl2ContextRequests=0;
  Object.defineProperty(canvas,'getContext',{
    configurable:true,
    writable:true,
    value:function(type,attributes){
      const context=originalGetContext.call(this,type,attributes);
      if(type==='webgl2'){
        webgl2ContextRequests++;
        if(!context)throw new Error('AUDRALIA_SINGLE_CONTEXT_WEBGL2_UNAVAILABLE');
        if(primaryGl===null)primaryGl=context;
        else if(context!==primaryGl)throw new Error('AUDRALIA_SINGLE_CONTEXT_IDENTITY_VIOLATION');
      }
      return context;
    }
  });
  let renderer;
  try{
    renderer=rendererModule.createMapWideEnvironmentRenderer(canvas);
  }finally{
    delete canvas.getContext;
  }
  if(!renderer||!primaryGl)throw new Error('AUDRALIA_SINGLE_CONTEXT_PRIMARY_RENDERER_MISSING');
  if(webgl2ContextRequests!==1)throw new Error(`AUDRALIA_SINGLE_CONTEXT_REQUEST_COUNT_${webgl2ContextRequests}`);
  return Object.freeze({renderer,primaryGl,webgl2ContextRequests});
}

function wire(renderer,clouds){
  const pointers=new Map();
  let gesture=null,wheelTimer=0;
  const safe=value=>Math.max(-64,Math.min(64,Number(value)||0));
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5});
  const ordered=()=>[...pointers.entries()].sort((a,b)=>Number(a[0])-Number(b[0]));
  const renderClouds=()=>clouds.render(cameraFrame(renderer));
  const beginTwo=()=>{
    const entries=ordered();
    if(entries.length!==2){gesture=null;return;}
    const a={...entries[0][1]},b={...entries[1][1]};
    gesture={ids:[entries[0][0],entries[1][0]],lastMid:midpoint(a,b),lastDistance:Math.max(1,distance(a,b)),mode:'PENDING'};
  };
  canvas.addEventListener('pointerdown',event=>{
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    clouds.beginInteraction();
    if(pointers.size===2)beginTwo();
  });
  canvas.addEventListener('pointermove',event=>{
    const previous=pointers.get(event.pointerId);
    if(!previous)return;
    const next={x:event.clientX,y:event.clientY};
    pointers.set(event.pointerId,next);
    if(pointers.size===1){
      renderer.orbit(safe(next.x-previous.x),safe(next.y-previous.y));
      renderClouds();
      return;
    }
    if(pointers.size!==2)return;
    if(!gesture)beginTwo();
    if(!gesture)return;
    const a=pointers.get(gesture.ids[0]),b=pointers.get(gesture.ids[1]);
    if(!a||!b)return;
    const mid=midpoint(a,b),dist=Math.max(1,distance(a,b));
    const common=Math.hypot(mid.x-gesture.lastMid.x,mid.y-gesture.lastMid.y);
    const zoom=Math.abs(dist-gesture.lastDistance)*.5;
    if(gesture.mode==='PENDING'){
      if(common>=2.2&&common>zoom*1.28)gesture.mode='TRAVEL';
      else if(zoom>=2&&zoom>common*1.2)gesture.mode='ZOOM';
      else return;
    }
    if(gesture.mode==='TRAVEL'){
      renderer.panScreen(safe((mid.x-gesture.lastMid.x)*1.45),safe((mid.y-gesture.lastMid.y)*1.45));
    }else{
      renderer.zoomByFactor(dist/Math.max(1,gesture.lastDistance));
    }
    gesture.lastMid=mid;
    gesture.lastDistance=dist;
    renderClouds();
  });
  const clear=event=>{
    pointers.delete(event.pointerId);
    if(pointers.size===2)beginTwo();else gesture=null;
    if(pointers.size===0){
      clouds.endInteraction();
      renderer.render();
      renderClouds();
    }else{
      clouds.beginInteraction();
    }
  };
  canvas.addEventListener('pointerup',clear);
  canvas.addEventListener('pointercancel',clear);
  canvas.addEventListener('lostpointercapture',clear);
  canvas.addEventListener('wheel',event=>{
    event.preventDefault();
    clouds.beginInteraction();
    renderer.zoom(event.deltaY);
    renderClouds();
    clearTimeout(wheelTimer);
    wheelTimer=setTimeout(()=>{
      clouds.endInteraction();
      renderer.render();
      renderClouds();
    },140);
  },{passive:false});
  canvas.addEventListener('dblclick',()=>{
    renderer.focusGratitude();
    clouds.endInteraction();
    renderClouds();
  });
  focusButton?.addEventListener('click',()=>{
    renderer.focusGratitude();
    clouds.endInteraction();
    renderClouds();
  });
  window.addEventListener('keydown',event=>{
    const key=event.key.toLowerCase();
    if(['w','arrowup'].includes(key))renderer.panScreen(0,-12);
    else if(['s','arrowdown'].includes(key))renderer.panScreen(0,12);
    else if(['a','arrowleft'].includes(key))renderer.panScreen(12,0);
    else if(['d','arrowright'].includes(key))renderer.panScreen(-12,0);
    else return;
    event.preventDefault();
    clouds.endInteraction();
    renderClouds();
  });
  window.addEventListener('resize',()=>{
    renderer.render();
    clouds.endInteraction();
    renderClouds();
  });
  return Object.freeze({renderClouds});
}

export async function initializeAudraliaTabletSingleContextClouds(){
  if(!(canvas instanceof HTMLCanvasElement))throw new Error('AUDRALIA_SINGLE_CONTEXT_CANVAS_MISSING');
  setStatus('building…','AUDRALIA_SINGLE_CONTEXT_CLOUDS_BUILDING');
  if(loaderStage)loaderStage.textContent='Building the Audralia world…';

  const startupSequence=[];
  const rendererModule=await import('./renderer.precomputed.mjs');
  const constructed=constructPrimaryRenderer(rendererModule);
  const renderer=constructed.renderer;
  startupSequence.push('PRIMARY_CONTEXT_READY');

  renderer.render();
  startupSequence.push('PRIMARY_WORLD_RENDERED');
  if(loaderStage)loaderStage.textContent='Audralia world ready · staging clouds…';
  await nextPaint();
  startupSequence.push('PRIMARY_WORLD_FRAME_PRESENTED');

  const clouds=createAudraliaTabletCloudPass({gl:constructed.primaryGl,worldCanvas:canvas});
  startupSequence.push('CLOUD_PASS_CONSTRUCTED');
  const controls=wire(renderer,clouds);
  controls.renderClouds();
  startupSequence.push('CLOUD_FIRST_DRAW');

  const worldIndex=startupSequence.indexOf('PRIMARY_WORLD_RENDERED');
  const presentedIndex=startupSequence.indexOf('PRIMARY_WORLD_FRAME_PRESENTED');
  const cloudConstructIndex=startupSequence.indexOf('CLOUD_PASS_CONSTRUCTED');
  const cloudDrawIndex=startupSequence.indexOf('CLOUD_FIRST_DRAW');
  const worldBeforeCloud=worldIndex>=0&&presentedIndex>worldIndex&&cloudConstructIndex>presentedIndex&&cloudDrawIndex>cloudConstructIndex;

  const failures=[];
  if(constructed.webgl2ContextRequests!==1)failures.push('WEBGL_CONTEXT_REQUEST_COUNT');
  if(clouds.getEvidence().primaryContextOnly!==true)failures.push('CLOUD_PRIMARY_CONTEXT_BINDING');
  if(clouds.getEvidence().createsCanvas!==false)failures.push('CLOUD_CANVAS_CREATION');
  if(clouds.getEvidence().regionalSystemsIncluded!==false)failures.push('REGIONAL_WEATHER_SCOPE');
  if(worldBeforeCloud!==true)failures.push('WORLD_BEFORE_CLOUD_ORDER');
  const runtime=Object.freeze({
    schema:'AUDRALIA_TABLET_SINGLE_CONTEXT_CLOUDS_RUNTIME_v2_WORLD_FIRST',
    renderer,
    clouds,
    renderingMode:'EXACT_PRIMARY_WORLD_SINGLE_WEBGL_CONTEXT_WITH_STAGED_CLOUD_PASS',
    fallbackActive:false,
    exactApprovedGeometry:true,
    cloudPassActive:true,
    worldRenderedBeforeCloudPass:worldBeforeCloud,
    startupSequence:Object.freeze([...startupSequence]),
    regionalWeatherDeferred:true,
    localWeatherDeferred:true,
    celestialDeferred:true,
    optionalMultiContextEnrichmentDeferred:true,
    invariants:Object.freeze({
      pass:failures.length===0,
      failures:Object.freeze(failures),
      singleWebGLContext:constructed.webgl2ContextRequests===1,
      webgl2ContextRequests:constructed.webgl2ContextRequests,
      cloudPassUsesPrimaryContext:clouds.getEvidence().primaryContextOnly===true,
      additionalCanvasCount:0,
      worldRenderedBeforeCloudPass:worldBeforeCloud
    }),
    getRuntime:()=>runtime,
    getCameraFrame:()=>cameraFrame(renderer),
    getCloudEvidence:()=>clouds.getEvidence()
  });

  if(runtime.invariants.pass!==true)throw new Error(`AUDRALIA_SINGLE_CONTEXT_CLOUD_INVARIANT_FAIL:${runtime.invariants.failures.join(',')}`);
  window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__=Object.freeze({
    operationId:runtime.schema,
    renderer,
    fallbackActive:false,
    cloudEvidence:clouds.getEvidence()
  });
  window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__=runtime;
  window.__AUDRALIA_TABLET_SINGLE_CONTEXT__=runtime;
  window.__AUDRALIA_TABLET_SINGLE_CONTEXT_CLOUDS__=runtime;
  setStatus('Audralia ready','AUDRALIA_SINGLE_CONTEXT_CLOUDS_READY');
  if(loaderStage)loaderStage.textContent='Audralia ready';
  if(loader){
    loader.classList.add('is-ready');
    setTimeout(()=>{loader.hidden=true;},420);
  }
  return runtime;
}

export default initializeAudraliaTabletSingleContextClouds;