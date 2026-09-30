import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';
import {
  PROOF_SCHEMA,
  FUNCTIONAL_WORLD_AUTHORITY,
  FUNCTIONAL_VISUAL_PARENT,
  LOCAL_CENTER_Z,
  PLANET_RADIUS,
  buildCanonicalWeatherObjects,
  tangentDirection,
  tangentPosition
} from './weather-model.mjs';
import {createCanonicalWeatherProjectionLayer} from './weather-renderer.mjs';

const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode=document.querySelector('[data-h-earth-status]');
const loader=document.querySelector('[data-audralia-loader]');
const loaderStage=document.querySelector('[data-audralia-loader-stage]');
const focusButton=document.querySelector('[data-fit-world]');
const proofSummary=document.querySelector('[data-proof-summary]');
const proofRows=document.querySelector('[data-proof-rows]');
const proofJson=document.querySelector('[data-proof-json]');
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

const setStatus=(text,state=text)=>{if(statusNode){statusNode.textContent=text;statusNode.dataset.status=state;}};
function normalizedLocalElevation(raw){const delta=raw-HYDRO.seaLevelY;if(delta<=22)return raw;const t=clamp((delta-22)/(76-22),0,1),s=t*t*(3-2*t);return HYDRO.seaLevelY+delta*(1+(0.60-1)*s);}
function sampleCanonicalSurfaceForProof(u,v){
  const z=v+LOCAL_CENTER_Z,localExact=u>=-256&&u<=256&&z>=-320&&z<=64;
  const terrain=sampleTerrain(u,z);
  if(terrain?.valid!==true)return Object.freeze({valid:false,u,v,z,elevation:HYDRO.seaLevelY,inside:false,exact:false});
  const shoreline=resolveHEarthMapWideShorelineZ(u),inside=z<=shoreline;
  const elevation=inside?normalizedLocalElevation(terrain.presentationElevation):HYDRO.seaLevelY;
  return Object.freeze({valid:true,u,v,z,elevation,inside,exact:localExact,terrain});
}
function cameraFrame(renderer){
  const snapshot=renderer.getSnapshot(),pitch=clamp(snapshot.pitch,.46,1.49),distance=clamp(snapshot.distance,95,5600),yaw=snapshot.yaw,targetU=snapshot.targetU,targetV=snapshot.targetV,direction=tangentDirection(targetU,targetV),groundSample=sampleCanonicalSurfaceForProof(targetU,targetV),ground=groundSample.inside?groundSample.elevation:HYDRO.seaLevelY,target=tangentPosition(targetU,targetV,ground),pU1=tangentPosition(targetU+1,targetV),pU0=tangentPosition(targetU-1,targetV),pV1=tangentPosition(targetU,targetV+1),pV0=tangentPosition(targetU,targetV-1),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),horizontal=norm(add(scale(eU,Math.sin(yaw)),scale(eV,Math.cos(yaw)))),eye=add(add(target,scale(direction,distance*Math.sin(pitch)+18)),scale(horizontal,distance*Math.cos(pitch))),forward=norm(sub(target,eye)),right=norm(cross(forward,direction)),up=norm(cross(right,forward));
  return Object.freeze({eye,target,forward,right,up,snapshot,groundSample,cameraSurfaceRegistration:groundSample.exact?'EXACT_LOCAL_CANONICAL_SURFACE':'BOUNDED_PROOF_FALLBACK_OUTSIDE_LOCAL_DOMAIN'});
}

function renderDiagnostics(runtime){
  if(!runtime)return;
  const {invariants,rayDiagnostics,spatial}=runtime;
  if(proofSummary)proofSummary.textContent=`${invariants.pass?'PASS':'FAIL'} · ${spatial.activeLocalCount}/${spatial.maxLocalCount} local volumes · ${runtime.renderPixels.toLocaleString()} cloud pixels`;
  if(proofRows){proofRows.replaceChildren(...rayDiagnostics.map(diag=>{
    const tr=document.createElement('tr');
    const values=[diag.ID_i,diag.Q_i?'yes':'no',`${diag.alpha_i.p.toFixed(2)} / ${diag.alpha_i.r.toFixed(2)} / ${diag.alpha_i.l.toFixed(2)}`,diag.I_camera_i?'inside':'outside',diag.L_i.toFixed(2),diag.tau_i.toFixed(3)];
    for(const value of values){const td=document.createElement('td');td.textContent=value;tr.appendChild(td);}return tr;
  }));}
  if(proofJson)proofJson.textContent=JSON.stringify({invariants,rayDiagnostics},null,2);
}

function wire(renderer,weather){
  const pointers=new Map();let gesture=null;
  const safe=value=>Math.max(-64,Math.min(64,value));
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5}),vectorLength=v=>Math.hypot(v.x,v.y),ordered=()=>[...pointers.entries()].sort((a,b)=>Number(a[0])-Number(b[0]));
  const beginTwo=()=>{const entries=ordered();if(entries.length!==2){gesture=null;return;}const a={...entries[0][1]},b={...entries[1][1]},mid=midpoint(a,b),dist=Math.max(1,distance(a,b));gesture={ids:[entries[0][0],entries[1][0]],startA:a,startB:b,startMid:mid,startDistance:dist,lastMid:mid,lastDistance:dist,mode:'PENDING'};};
  const refresh=()=>{if(pointers.size===2)beginTwo();else gesture=null;};
  const redraw=()=>weather.render(cameraFrame(renderer));
  canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});weather.beginInteraction();if(pointers.size===2)beginTwo();else if(pointers.size>2)gesture=null;});
  canvas.addEventListener('pointermove',event=>{const previous=pointers.get(event.pointerId);if(!previous)return;const next={x:event.clientX,y:event.clientY};pointers.set(event.pointerId,next);if(pointers.size===1){renderer.orbit(safe(next.x-previous.x),safe(next.y-previous.y));redraw();return;}if(pointers.size!==2)return;if(!gesture)beginTwo();if(!gesture)return;const a=pointers.get(gesture.ids[0]),b=pointers.get(gesture.ids[1]);if(!a||!b){beginTwo();return;}const mid=midpoint(a,b),dist=Math.max(1,distance(a,b)),d1={x:a.x-gesture.startA.x,y:a.y-gesture.startA.y},d2={x:b.x-gesture.startB.x,y:b.y-gesture.startB.y},common={x:(d1.x+d2.x)*.5,y:(d1.y+d2.y)*.5},opposing={x:(d1.x-d2.x)*.5,y:(d1.y-d2.y)*.5},commonMagnitude=vectorLength(common),opposingMagnitude=vectorLength(opposing),pinchMagnitude=Math.abs(dist-gesture.startDistance)*.5,zoomEvidence=Math.max(opposingMagnitude,pinchMagnitude);if(gesture.mode==='PENDING'){if(commonMagnitude>=2.2&&commonMagnitude>zoomEvidence*1.28)gesture.mode='TRAVEL';else if(zoomEvidence>=2&&zoomEvidence>commonMagnitude*1.20)gesture.mode='ZOOM';else return;gesture.lastMid=mid;gesture.lastDistance=dist;return;}if(gesture.mode==='TRAVEL'){const dx=mid.x-gesture.lastMid.x,dy=mid.y-gesture.lastMid.y;if(Math.abs(dx)>.01||Math.abs(dy)>.01)renderer.panScreen(safe(dx*1.45),safe(dy*1.45));}else{const ratio=dist/Math.max(1,gesture.lastDistance);if(Math.abs(Math.log(Math.max(.001,ratio)))>=.00035)renderer.zoomByFactor(ratio);}gesture.lastMid=mid;gesture.lastDistance=dist;redraw();});
  const clear=event=>{pointers.delete(event.pointerId);refresh();if(pointers.size===0){weather.endInteraction();redraw();}else weather.beginInteraction();};
  canvas.addEventListener('pointerup',clear);canvas.addEventListener('pointercancel',clear);canvas.addEventListener('lostpointercapture',clear);
  canvas.addEventListener('wheel',event=>{event.preventDefault();weather.beginInteraction();renderer.zoom(event.deltaY);redraw();clearTimeout(wire.wheelTimer);wire.wheelTimer=setTimeout(()=>{weather.endInteraction();redraw();},140);},{passive:false});
  canvas.addEventListener('dblclick',()=>{renderer.focusGratitude();weather.endInteraction();redraw();});focusButton?.addEventListener('click',()=>{renderer.focusGratitude();weather.endInteraction();redraw();});
  window.addEventListener('keydown',event=>{const key=event.key.toLowerCase();if(['w','arrowup'].includes(key))renderer.panScreen(0,-12);else if(['s','arrowdown'].includes(key))renderer.panScreen(0,12);else if(['a','arrowleft'].includes(key))renderer.panScreen(12,0);else if(['d','arrowright'].includes(key))renderer.panScreen(-12,0);else return;event.preventDefault();redraw();});
  window.addEventListener('resize',()=>{renderer.render();weather.endInteraction();redraw();});
}

async function initialize(){
  try{
    if(!(canvas instanceof HTMLCanvasElement))throw new Error('CANONICAL_WEATHER_PROOF_CANVAS_MISSING');
    setStatus('building…','CANONICAL_WEATHER_PROOF_BUILDING');if(loaderStage)loaderStage.textContent='Building canonical weather objects…';
    const rendererModule=await import('../../h-earth/terrain-estate-construction-v1/renderer.mjs');
    const renderer=rendererModule.createMapWideEnvironmentRenderer(canvas);renderer.render();
    const objects=buildCanonicalWeatherObjects(sampleCanonicalSurfaceForProof);
    const weather=createCanonicalWeatherProjectionLayer({renderer,worldCanvas:canvas,objects,onDiagnostics:renderDiagnostics});
    const first=weather.render(cameraFrame(renderer));wire(renderer,weather);
    const publicReceipt={
      schema:PROOF_SCHEMA,functionalWorldAuthority:FUNCTIONAL_WORLD_AUTHORITY,functionalVisualParent:FUNCTIONAL_VISUAL_PARENT,
      cameraSemanticsMutated:false,zoomSemanticsMutated:false,travelSemanticsMutated:false,terrainClearanceRenderingAuthority:false,
      canonicalObjects:objects,renderer,weather,
      getCameraFrame:()=>cameraFrame(renderer),getRuntime:()=>weather.getDiagnostics(),
      setCameraStateForProof:partial=>{Object.assign(renderer.state,partial||{});renderer.render();return weather.render(cameraFrame(renderer));}
    };
    window.__AUDRALIA_CANONICAL_WEATHER_SPATIAL_LOD_PROOF__=Object.freeze(publicReceipt);
    setStatus('REVIEW','CANONICAL_WEATHER_SPATIAL_LOD_PROOF_USER_REVIEW_REQUIRED');
    if(loaderStage)loaderStage.textContent='Weather proof ready';if(loader){loader.classList.add('is-ready');setTimeout(()=>{loader.hidden=true;},360);}
    if(first?.invariants?.pass!==true)throw new Error(`CANONICAL_WEATHER_RUNTIME_INVARIANT_FAIL:${(first?.invariants?.failures||[]).join(',')}`);
  }catch(error){console.error('CANONICAL_WEATHER_PROOF_INITIALIZATION_FAILED',error);setStatus('ERROR','CANONICAL_WEATHER_PROOF_INITIALIZATION_FAILED');if(loaderStage)loaderStage.textContent='Canonical weather proof could not finish loading';loader?.classList.add('is-error');}
}

setStatus('boot…','CANONICAL_WEATHER_PROOF_BOOT');initialize();
