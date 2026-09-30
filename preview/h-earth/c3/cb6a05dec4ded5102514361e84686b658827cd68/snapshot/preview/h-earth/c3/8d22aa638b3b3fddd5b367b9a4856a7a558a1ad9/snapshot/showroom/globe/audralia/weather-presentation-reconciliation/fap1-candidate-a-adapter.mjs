import {
  buildHEarthFAP1AtmosphereCandidate,
  evaluateHEarthFAP1AtmosphereCandidate
} from '../../h-earth/render/environment-atmosphere.fap1-candidate-a.js';

const PLANET_RADIUS=6200;
const PLANET_CENTER=[0,-PLANET_RADIUS,0];
const NORTH=[0,.5,-.8660254037844386];
const MERIDIAN=[0,.8660254037844386,.5];
const EAST=[1,0,0];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const radToDeg=v=>v*180/Math.PI;

function cameraWeatherLocation(camera){
  const radial=norm(sub(camera.target,PLANET_CENTER));
  return Object.freeze({
    latitudeDeg:radToDeg(Math.asin(clamp(dot(radial,NORTH),-1,1))),
    longitudeDeg:radToDeg(Math.atan2(dot(radial,EAST),dot(radial,MERIDIAN)))
  });
}

function requestedQualityMode(){
  const value=new URLSearchParams(globalThis.location?.search||'').get('fap1Quality');
  return value?.toLowerCase()==='capture'?'CAPTURE':'INTERACTIVE';
}

export function createFAP1CandidateAReconciliationAdapter({exterior,sky}={}){
  if(!exterior?.overlay||!sky?.overlay)throw new Error('FAP1_CANDIDATE_A_PREVIEW_INPUT_INVALID');
  let interacting=false,lastPlan=null;

  function render(camera){
    const location=cameraWeatherLocation(camera);
    const qualityMode=requestedQualityMode();
    const plan=buildHEarthFAP1AtmosphereCandidate({
      ...location,
      canonicalTimeHours:0,
      observerElevation:Math.max(0,Math.hypot(...sub(camera.eye,PLANET_CENTER))-PLANET_RADIUS),
      viewDistance:camera.snapshot?.distance??512,
      qualityMode
    });
    const evaluation=evaluateHEarthFAP1AtmosphereCandidate(plan);
    if(evaluation.eligible!==true)throw new Error(`FAP1_CANDIDATE_A_PLAN_REJECTED:${evaluation.issues.join(',')}`);

    const cloud=plan.weather.cloudOccupancy;
    const clear=plan.weather.clearAirSupport;
    const haze=plan.optics.hazeExtinctionSupport;
    const weatherOpacity=clamp(.34+cloud*.88,clear>.55?.28:.34,1);
    const skySaturation=clamp(1.02+clear*.20-haze*.08,.94,1.22);
    const skyBrightness=clamp(1.01+clear*.08-haze*.07,.94,1.12);

    exterior.overlay.style.opacity=weatherOpacity.toFixed(3);
    exterior.overlay.dataset.fap1WeatherClass=plan.weather.weatherClass;
    exterior.overlay.dataset.fap1WeatherIdentity=plan.weather.stateIdentity;
    exterior.overlay.dataset.fap1CloudOccupancy=cloud.toFixed(3);
    exterior.overlay.dataset.fap1ClearAirSupport=clear.toFixed(3);
    exterior.overlay.dataset.fap1QualityMode=qualityMode;
    exterior.overlay.dataset.fap1EmptyAirCheap=String(plan.weather.skipVolumeTraversalEligible===true);

    sky.overlay.style.filter=`saturate(${skySaturation.toFixed(3)}) brightness(${skyBrightness.toFixed(3)})`;
    sky.overlay.dataset.fap1ClearAirSupport=clear.toFixed(3);
    sky.overlay.dataset.fap1HazeSupport=haze.toFixed(3);
    sky.overlay.dataset.fap1GrayFallback='false';

    lastPlan=plan;
    globalThis.__AUDRALIA_FAP1_CANDIDATE_A_RUNTIME__=Object.freeze({
      location,
      qualityMode,
      interacting,
      plan,
      evaluation
    });
    return plan;
  }

  return Object.freeze({
    render,
    beginInteraction:()=>{interacting=true;},
    endInteraction:()=>{interacting=false;},
    getPlan:()=>lastPlan,
    getEvidence:()=>Object.freeze({
      schema:'AUDRALIA_FAP1_CANDIDATE_A_EXISTING_HARNESS_ADAPTER_v1',
      reusesExistingPreviewHarness:true,
      createsPreviewRoute:false,
      createsCamera:false,
      createsRendererShell:false,
      mutatesGeography:false,
      mutatesLiveRoute:false,
      opticsDrivenByCandidateA:true,
      weatherStateDrivenByCandidateA:true,
      qualityMode:requestedQualityMode(),
      lastWeatherClass:lastPlan?.weather?.weatherClass??null,
      lastWeatherIdentity:lastPlan?.weather?.stateIdentity??null
    })
  });
}
