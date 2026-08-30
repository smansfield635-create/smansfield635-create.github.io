import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
import {
  LOCAL_CENTER_Z,
  buildCanonicalWeatherObjects,
  tangentDirection,
  tangentPosition
} from '../canonical-weather-spatial-lod-proof/weather-model.mjs';
import {createCanonicalWeatherProjectionLayer} from '../canonical-weather-spatial-lod-proof/weather-renderer.mjs';
import {createClearAtmosphereLayer} from './clear-atmosphere.mjs';
import {createExteriorWeatherProjection} from './exterior-weather.mjs';
import {createFAP1CandidateAReconciliationAdapter} from './fap1-candidate-a-adapter.mjs';
import {
  RECONCILIATION_SCHEMA,
  VIDEO_CAMERA_REGRESSION,
  FUNCTIONAL_WORLD_AUTHORITY,
  FUNCTIONAL_VISUAL_PARENT,
  CANONICAL_WEATHER_PROOF_HEAD,
  EXTERIOR_COMPONENT_CLASSIFICATION,
  RECONCILIATION_INVARIANTS
} from './exterior-classification.mjs';

const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode=document.querySelector('[data-h-earth-status]');
const loader=document.querySelector('[data-audralia-loader]');
const loaderStage=document.querySelector('[data-audralia-loader-stage]');
const focusButton=document.querySelector('[data-fit-world]');
const summaryNode=document.querySelector('[data-reconciliation-summary]');
const rowsNode=document.querySelector('[data-reconciliation-rows]');
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const setStatus=(text,state=text)=>{if(statusNode){statusNode.textContent=text;statusNode.dataset.status=state;}};

function normalizedLocalElevation(raw){const delta=raw-HYDRO.seaLevelY;if(delta<=22)return raw;const t=clamp((delta-22)/(76-22),0,1),s=t*t*(3-2*t);return HYDRO.seaLevelY+delta*(1+(0.60-1)*s);}
function sampleCanonicalSurface(u,v){const z=v+LOCAL_CENTER_Z,terrain=sampleTerrain(u,z);if(terrain?.valid!==true)return Object.freeze({valid:false,u,v,z,elevation:HYDRO.seaLevelY,inside:false});const shoreline=resolveHEarthMapWideShorelineZ(u),inside=z<=shoreline,elevation=inside?normalizedLocalElevation(terrain.presentationElevation):HYDRO.seaLevelY;return Object.freeze({valid:true,u,v,z,elevation,inside,terrain});}
function cameraFrame(renderer){const snapshot=renderer.getSnapshot(),pitch=clamp(snapshot.pitch,.46,1.49),distance=clamp(snapshot.distance,95,5600),yaw=snapshot.yaw,targetU=snapshot.targetU,targetV=snapshot.targetV,direction=tangentDirection(targetU,targetV),groundSample=sampleCanonicalSurface(targetU,targetV),ground=groundSample.inside?groundSample.elevation:HYDRO.seaLevelY,target=tangentPosition(targetU,targetV,ground),pU1=tangentPosition(targetU+1,targetV),pU0=tangentPosition(targetU-1,targetV),pV1=tangentPosition(targetU,targetV+1),pV0=tangentPosition(targetU,targetV-1),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),horizontal=norm(add(scale(eU,Math.sin(yaw)),scale(eV,Math.cos(yaw)))),eye=add(add(target,scale(direction,distance*Math.sin(pitch)+18)),scale(horizontal,distance*Math.cos(pitch))),forward=norm(sub(target,eye)),right=norm(cross(forward,direction)),up=norm(cross(right,forward));return Object.freeze({eye,target,forward,right,up,snapshot,groundSample});}
function getSunDirection(){return window.__AUDRALIA_CELESTIAL_STATE__?.getSolarVector?.()||[.42,.78,.46];}

function renderDiagnostics(runtime,renderer,exterior,fap1){
  const plan=fap1?.getPlan?.();
  const weather=plan?.weather?.weatherClass??'—';
  const quality=plan?.quality?.id??'—';
  if(summaryNode)summaryNode.textContent=`${runtime?.invariants?.pass?'ARCHITECTURE PASS':'ARCHITECTURE FAIL'} · ${renderer.getViewScale()} · FAP1 ${weather}/${quality} · ${runtime?.spatial?.activeLocalCount??0}/${runtime?.spatial?.maxLocalCount??0} local · exterior cutoff ${exterior.overlay.dataset.nearCutoff||'—'}`;
  if(rowsNode&&runtime?.rayDiagnostics){rowsNode.replaceChildren(...runtime.rayDiagnostics.map(diag=>{const tr=document.createElement('tr');for(const value of [diag.ID_i,diag.Q_i?'yes':'no',`${diag.alpha_i.p.toFixed(2)} / ${diag.alpha_i.r.toFixed(2)} / ${diag.alpha_i.l.toFixed(2)}`,diag.I_camera_i?'inside':'outside',diag.L_i.toFixed(1),diag.tau_i.toFixed(3)]){const td=document.createElement('td');td.textContent=value;tr.appendChild(td);}return tr;}));}
}

function wire(renderer,sky,exterior,canonical,fap1){
  const pointers=new Map();let gesture=null,wheelTimer=0;
  const safe=value=>Math.max(-64,Math.min(64,value));
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5}),vectorLength=v=>Math.hypot(v.x,v.y),ordered=()=>[...pointers.entries()].sort((a,b)=>Number(a[0])-Number(b[0]));
  const beginTwo=()=>{const entries=ordered();if(entries.length!==2){gesture=null;return;}const a={...entries[0][1]},b={...entries[1][1]},mid=midpoint(a,b),dist=Math.max(1,distance(a,b));gesture={ids:[entries[0][0],entries[1][0]],startA:a,startB:b,startMid:mid,startDistance:dist,lastMid:mid,lastDistance:dist,mode:'PENDING'};};
  const refresh=()=>{if(pointers.size===2)beginTwo();else gesture=null;};
  const renderAll=()=>{const camera=cameraFrame(renderer);sky.render(camera);exterior.render(camera);fap1.render(camera);const runtime=canonical.render(camera);renderDiagnostics(runtime,renderer,exterior,fap1);window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_RUNTIME__=runtime;return runtime;};
  canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});fap1.beginInteraction();exterior.beginInteraction();canonical.beginInteraction();if(pointers.size===2)beginTwo();else if(pointers.size>2)gesture=null;});
  canvas.addEventListener('pointermove',event=>{const previous=pointers.get(event.pointerId);if(!previous)return;const next={x:event.clientX,y:event.clientY};pointers.set(event.pointerId,next);if(pointers.size===1){renderer.orbit(safe(next.x-previous.x),safe(next.y-previous.y));renderAll();return;}if(pointers.size!==2)return;if(!gesture)beginTwo();if(!gesture)return;const a=pointers.get(gesture.ids[0]),b=pointers.get(gesture.ids[1]);if(!a||!b){beginTwo();return;}const mid=midpoint(a,b),dist=Math.max(1,distance(a,b)),d1={x:a.x-gesture.startA.x,y:a.y-gesture.startA.y},d2={x:b.x-gesture.startB.x,y:b.y-gesture.startB.y},common={x:(d1.x+d2.x)*.5,y:(d1.y+d2.y)*.5},opposing={x:(d1.x-d2.x)*.5,y:(d1.y-d2.y)*.5},commonMagnitude=vectorLength(common),opposingMagnitude=vectorLength(opposing),pinchMagnitude=Math.abs(dist-gesture.startDistance)*.5,zoomEvidence=Math.max(opposingMagnitude,pinchMagnitude);if(gesture.mode==='PENDING'){if(commonMagnitude>=2.2&&commonMagnitude>zoomEvidence*1.28)gesture.mode='TRAVEL';else if(zoomEvidence>=2&&zoomEvidence>commonMagnitude*1.20)gesture.mode='ZOOM';else return;gesture.lastMid=mid;gesture.lastDistance=dist;return;}if(gesture.mode==='TRAVEL'){const dx=mid.x-gesture.lastMid.x,dy=mid.y-gesture.lastMid.y;if(Math.abs(dx)>.01||Math.abs(dy)>.01)renderer.panScreen(safe(dx*1.45),safe(dy*1.45));}else{const ratio=dist/Math.max(1,gesture.lastDistance);if(Math.abs(Math.log(Math.max(.001,ratio)))>=.00035)renderer.zoomByFactor(ratio);}gesture.lastMid=mid;gesture.lastDistance=dist;renderAll();});
  const clear=event=>{pointers.delete(event.pointerId);refresh();if(pointers.size===0){fap1.endInteraction();exterior.endInteraction();canonical.endInteraction();renderAll();}else{fap1.beginInteraction();exterior.beginInteraction();canonical.beginInteraction();}};
  canvas.addEventListener('pointerup',clear);canvas.addEventListener('pointercancel',clear);canvas.addEventListener('lostpointercapture',clear);
  canvas.addEventListener('wheel',event=>{event.preventDefault();fap1.beginInteraction();exterior.beginInteraction();canonical.beginInteraction();renderer.zoom(event.deltaY);renderAll();clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{fap1.endInteraction();exterior.endInteraction();canonical.endInteraction();renderAll();},140);},{passive:false});
  canvas.addEventListener('dblclick',()=>{renderer.focusGratitude();fap1.endInteraction();exterior.endInteraction();canonical.endInteraction();renderAll();});focusButton?.addEventListener('click',()=>{renderer.focusGratitude();fap1.endInteraction();exterior.endInteraction();canonical.endInteraction();renderAll();});
  window.addEventListener('keydown',event=>{const key=event.key.toLowerCase();if(['w','arrowup'].includes(key))renderer.panScreen(0,-12);else if(['s','arrowdown'].includes(key))renderer.panScreen(0,12);else if(['a','arrowleft'].includes(key))renderer.panScreen(12,0);else if(['d','arrowright'].includes(key))renderer.panScreen(-12,0);else return;event.preventDefault();renderAll();});
  window.addEventListener('resize',()=>{renderer.render();fap1.endInteraction();exterior.endInteraction();canonical.endInteraction();renderAll();});
  window.addEventListener('AUDRALIA_CELESTIAL_CONTEXT_READY',()=>renderAll(),{once:true});
  return Object.freeze({renderAll});
}

async function initializeCanvasFallback(){
  const fallbackModule=await import('./canvas-fallback.mjs');
  const renderer=fallbackModule.createAudraliaCanvasFallback({canvas,focusButton});
  const runtime=Object.freeze({
    schema:RECONCILIATION_SCHEMA,
    mode:'CANVAS_2D_FALLBACK',
    fallbackActive:true,
    spatial:Object.freeze({activeLocalCount:0,maxLocalCount:0}),
    rayDiagnostics:Object.freeze([]),
    invariants:Object.freeze({pass:true,failures:Object.freeze([]),mode:'CANVAS_2D_FALLBACK',fullWebGLRuntime:false})
  });
  const receipt=Object.freeze({
    schema:RECONCILIATION_SCHEMA,
    videoCameraRegression:VIDEO_CAMERA_REGRESSION,
    functionalWorldAuthority:FUNCTIONAL_WORLD_AUTHORITY,
    functionalVisualParent:FUNCTIONAL_VISUAL_PARENT,
    canonicalWeatherProofHead:CANONICAL_WEATHER_PROOF_HEAD,
    renderer,
    fallbackActive:true,
    renderingMode:'CANVAS_2D_FALLBACK',
    invariants:runtime.invariants,
    getRuntime:()=>runtime
  });
  window.__AUDRALIA_CANVAS_FALLBACK_ACTIVE__=true;
  window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_RUNTIME__=runtime;
  window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__=receipt;
  window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__=Object.freeze({operationId:RECONCILIATION_SCHEMA,renderer,fallbackActive:true});
  setStatus('Audralia map · reduced graphics','AUDRALIA_CANVAS_FALLBACK_READY');
  if(loaderStage)loaderStage.textContent='Audralia ready · reduced graphics';
  if(loader){loader.classList.add('is-ready');setTimeout(()=>{loader.hidden=true;},420);}
  return runtime;
}

async function initialize(){
  try{
    if(!(canvas instanceof HTMLCanvasElement))throw new Error('AUDRALIA_RECONCILIATION_CANVAS_MISSING');
    setStatus('building…','AUDRALIA_WEATHER_RECONCILIATION_BUILDING');if(loaderStage)loaderStage.textContent='Reconciling sky and FAP1 weather…';
    const rendererModule=await import('../../h-earth/terrain-estate-construction-v1/renderer.mjs');
    const renderer=rendererModule.createMapWideEnvironmentRenderer(canvas);renderer.render();
    const objects=buildCanonicalWeatherObjects(sampleCanonicalSurface);
    const sky=createClearAtmosphereLayer({renderer,worldCanvas:canvas,getSunDirection});
    const exterior=createExteriorWeatherProjection({renderer,worldCanvas:canvas,getSunDirection});
    const fap1=createFAP1CandidateAReconciliationAdapter({exterior,sky});
    const canonical=createCanonicalWeatherProjectionLayer({renderer,worldCanvas:canvas,objects,onDiagnostics:runtime=>renderDiagnostics(runtime,renderer,exterior,fap1)});
    const controls=wire(renderer,sky,exterior,canonical,fap1);
    const first=controls.renderAll();
    const receipt=Object.freeze({
      schema:RECONCILIATION_SCHEMA,videoCameraRegression:VIDEO_CAMERA_REGRESSION,functionalWorldAuthority:FUNCTIONAL_WORLD_AUTHORITY,functionalVisualParent:FUNCTIONAL_VISUAL_PARENT,canonicalWeatherProofHead:CANONICAL_WEATHER_PROOF_HEAD,
      cameraSemanticsMutated:false,zoomSemanticsMutated:false,travelSemanticsMutated:false,
      renderer,canonicalObjects:objects,sky,exterior,canonicalWeather:canonical,fap1CandidateA:fap1,
      classification:EXTERIOR_COMPONENT_CLASSIFICATION,invariants:RECONCILIATION_INVARIANTS,
      getCameraFrame:()=>cameraFrame(renderer),getRuntime:()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_RUNTIME__,getFAP1Plan:()=>fap1.getPlan(),
      setCameraStateForTest:partial=>{Object.assign(renderer.state,partial||{});renderer.render();return controls.renderAll();}
    });
    window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__=Object.freeze({operationId:RECONCILIATION_SCHEMA,renderer,atmosphereEvidence:sky.getEvidence(),cloudEvidence:Object.freeze({exterior:exterior.getEvidence(),canonical:canonical.getEvidence?.()||null,fap1:fap1.getEvidence()})});
    window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__=receipt;
    if(first?.invariants?.pass!==true)throw new Error(`RECONCILIATION_CANONICAL_INVARIANT_FAIL:${(first?.invariants?.failures||[]).join(',')}`);
    setStatus('FAP1 REVIEW','AUDRALIA_FAP1_CANDIDATE_A_USER_REVIEW_REQUIRED');if(loaderStage)loaderStage.textContent='Audralia FAP1 Candidate A ready';if(loader){loader.classList.add('is-ready');setTimeout(()=>{loader.hidden=true;},420);}
  }catch(error){
    if(String(error?.message||error).includes('WEBGL2_')){
      try{
        await initializeCanvasFallback();
        return;
      }catch(fallbackError){
        error=fallbackError;
      }
    }
    const message=error instanceof Error?error.message:String(error),stack=error instanceof Error?error.stack:null;
    window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__=Object.freeze({schema:RECONCILIATION_SCHEMA,message,stack});
    console.error('AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_FAILED',message,stack||'');
    setStatus('ERROR','AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_FAILED');if(loaderStage)loaderStage.textContent=`Audralia reconciliation could not finish loading · ${message}`;loader?.classList.add('is-error');
  }
}

setStatus('boot…','AUDRALIA_WEATHER_RECONCILIATION_BOOT');initialize();