const loader=document.querySelector('[data-audralia-loader]');
const stage=document.querySelector('[data-audralia-loader-stage]');
const track=document.querySelector('[data-audralia-loader-track]');
const fill=document.querySelector('[data-audralia-loader-fill]');
const progress=document.querySelector('[data-audralia-loader-progress]');
const note=document.querySelector('[data-audralia-loader-note]');

const STAGES=Object.freeze([
  ['BOOTSTRAP',6,'Preparing Audralia'],
  ['MODULE_GRAPH',16,'Loading world systems'],
  ['WORLD',38,'Constructing planetary surface'],
  ['ATMOSPHERE',56,'Building atmosphere'],
  ['REGIONAL_WEATHER',72,'Resolving regional weather'],
  ['LOCAL_WEATHER',86,'Resolving local weather'],
  ['CONTINUITY',95,'Validating one-world continuity'],
  ['READY',100,'Audralia ready']
]);
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const gaProofMode=(()=>{try{return new URLSearchParams(location.search).get('gaProof')==='1';}catch(_error){return false;}})();
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let verified=0;
let displayed=0;
let ceiling=15;
let failed=false;
let activityTimer=0;
let timeoutTimer=0;

function paint(){
  const bounded=Math.max(0,Math.min(100,displayed));
  if(fill){fill.style.animation='none';fill.style.left='0';fill.style.width=`${bounded}%`;fill.style.transition=reducedMotion?'none':'width .28s cubic-bezier(.2,.8,.2,1)';}
  if(progress)progress.textContent=`${Math.floor(bounded)}%`;
  if(track){track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(Math.floor(bounded)));}
  if(loader)loader.dataset.progress=String(Math.floor(bounded));
}
function setVerified(value,label,nextCeiling=value){if(failed)return;verified=Math.max(verified,value);displayed=Math.max(displayed,verified);ceiling=Math.max(verified,nextCeiling);if(stage)stage.textContent=label;paint();}
function beginActivity(){clearInterval(activityTimer);if(reducedMotion)return;activityTimer=setInterval(()=>{if(failed||displayed>=ceiling)return;displayed=Math.min(ceiling,displayed+1);paint();},430);}
function fail(label,error){
  if(failed)return;failed=true;clearInterval(activityTimer);clearTimeout(timeoutTimer);
  const message=error instanceof Error?error.message:String(error||'unknown startup error');
  if(loader)loader.classList.add('is-error');if(stage)stage.textContent=label;if(progress)progress.textContent=`Held at ${Math.floor(displayed)}%`;
  if(note){note.textContent=`Audralia did not finish this startup stage: ${message}`;const retry=document.createElement('button');retry.type='button';retry.textContent='Retry Audralia';retry.style.cssText='margin-top:14px;padding:10px 16px;border:1px solid rgba(225,239,219,.28);border-radius:999px;background:rgba(225,239,219,.08);color:inherit;font:inherit';retry.addEventListener('click',()=>location.reload());note.after(retry);}
  window.__AUDRALIA_STARTUP_FAILURE__=Object.freeze({message,progress:displayed});
}
async function waitFor(predicate,label,attempts=480){
  for(let i=0;i<attempts;i++){const value=predicate();if(value)return value;if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__)throw new Error(`QUALIFICATION_PARENT_FAILED:${label}`);if(window.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__)throw new Error(`QUALIFICATION_GA_FAILED:${window.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__.message}`);if(window.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__)throw new Error(`GC_L5_HANDOFF_FAILED:${window.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__.message}`);await sleep(25);}
  throw new Error(`QUALIFICATION_WAIT_TIMEOUT:${label}`);
}
function observeRuntime(){
  if(failed)return;
  if(document.querySelector('[data-audralia-clear-atmosphere="true"]'))setVerified(56,'Atmosphere ready',70);
  if(document.querySelector('[data-audralia-exterior-weather="true"]'))setVerified(72,'Regional weather ready',84);
  if(document.querySelector('[data-canonical-weather-projection="true"]'))setVerified(86,'Local weather ready',94);
  const runtime=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.();
  const ga=window.__AUDRALIA_FAP1_GA_AUTHORITY__;
  const gb=window.__AUDRALIA_FAP1_W5_HANDOFF__;
  const gbReady=gaProofMode||(gb?.authority==='BOUNDED_GB_HANDOFF_ACTIVE'&&gb?.l5LightingActive===true&&gb?.l5LightingModel==='DIRECT_SUN_TRANSMITTANCE_ONLY');
  if(runtime?.invariants?.pass===true&&ga?.meteorologicalAuthority==='FAP1_ONLY'&&gbReady){
    setVerified(100,gaProofMode?'Audralia ready · G_A proof active':'Audralia ready · W5 + L5 direct light active',100);clearInterval(activityTimer);clearTimeout(timeoutTimer);
    if(note)note.textContent=gaProofMode?'One continuous world is ready · G_A negative-proof harness is running.':'One continuous world is ready · FAP1 weather authority, bounded W5 handoff, and direct L5 cloud self-shadowing are active.';
    if(loader){loader.classList.add('is-ready');setTimeout(()=>{loader.hidden=true;},460);}return;
  }
  if(window.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__&&!gaProofMode){fail('W5 / L5 local atmosphere stopped',window.__AUDRALIA_FAP1_W5_HANDOFF_ERROR__.message);return;}
  if(window.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__){fail('FAP1 authority convergence stopped',window.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__.message);return;}
  if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__){fail('World initialization stopped',window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__.message);return;}
  requestAnimationFrame(observeRuntime);
}
async function boot(){
  setVerified(6,'Preparing Audralia',15);beginActivity();
  try{
    setVerified(16,'Loading world systems',34);
    await waitFor(()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.renderer&&typeof window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getCameraFrame==='function','PARENT_RECEIPT');
    await import('./fap1-ga-authority-bootstrap.mjs?cb=FAP1_GA_v3');
    await waitFor(()=>window.__AUDRALIA_FAP1_GA_AUTHORITY__?.meteorologicalAuthority==='FAP1_ONLY'&&typeof window.__AUDRALIA_FAP1_GA_AUTHORITY__?.renderNow==='function','GA_AUTHORITY');
    if(gaProofMode){
      await import('./fap1-ga-negative-proof-v2.mjs?cb=FAP1_GA_NEGATIVE_PROOF_v3');
    }else{
      await import('./fap1-w5-handoff-bootstrap.gb.mjs?cb=FAP1_GC_L5_DIRECT_v1');
      await waitFor(()=>window.__AUDRALIA_FAP1_W5_HANDOFF__?.authority==='BOUNDED_GB_HANDOFF_ACTIVE'&&window.__AUDRALIA_FAP1_W5_HANDOFF__?.l5LightingActive===true,'GC_L5_DIRECT');
    }
    setVerified(38,'Constructing planetary surface',54);requestAnimationFrame(observeRuntime);
  }catch(error){console.error('AUDRALIA_STARTUP_MODULE_GRAPH_FAILED',error);fail('World systems could not load',error);}
}
window.addEventListener('error',event=>{if(!failed&&displayed<100&&event?.error)fail('Audralia startup encountered an error',event.error);});
window.addEventListener('unhandledrejection',event=>{if(!failed&&displayed<100)fail('Audralia startup encountered an error',event.reason);});
timeoutTimer=setTimeout(()=>{if(!failed&&displayed<100){if(stage)stage.textContent='Still building Audralia…';if(note)note.textContent='This device is taking longer than expected. Startup is still active; if it cannot continue, the failed stage will be shown here.';}},18000);
boot();
