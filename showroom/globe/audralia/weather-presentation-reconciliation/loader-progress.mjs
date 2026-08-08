const loader=document.querySelector('[data-audralia-loader]');
const stage=document.querySelector('[data-audralia-loader-stage]');
const track=document.querySelector('[data-audralia-loader-track]');
const fill=document.querySelector('[data-audralia-loader-fill]');
const progress=document.querySelector('[data-audralia-loader-progress]');
const TOTAL=4;
let completed=-1;

function commit(next,label){
  if(next<=completed)return;
  completed=next;
  const bounded=Math.max(0,Math.min(TOTAL,next));
  const ratio=bounded/TOTAL;
  if(stage)stage.textContent=label;
  if(progress)progress.textContent=`${bounded} of ${TOTAL} systems ready`;
  if(track){track.setAttribute('aria-valuenow',String(bounded));track.dataset.completed=String(bounded);}
  if(fill)fill.style.setProperty('--audralia-loader-progress',`${Math.round(ratio*100)}%`);
  if(loader)loader.dataset.progress=String(bounded);
}

function observe(){
  if(loader?.classList.contains('is-error'))return;
  if(document.querySelector('[data-audralia-clear-atmosphere="true"]'))commit(1,'World and surface atmosphere ready');
  if(document.querySelector('[data-audralia-exterior-weather="true"]'))commit(2,'Regional weather ready');
  if(document.querySelector('[data-canonical-weather-projection="true"]'))commit(3,'Bounded local weather ready');
  if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()?.invariants?.pass===true){commit(4,'Audralia ready');return;}
  requestAnimationFrame(observe);
}

commit(0,'Preparing world and camera…');
requestAnimationFrame(observe);
