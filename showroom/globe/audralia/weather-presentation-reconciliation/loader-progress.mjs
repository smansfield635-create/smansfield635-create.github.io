const loader=document.querySelector('[data-audralia-loader]');
const stage=document.querySelector('[data-audralia-loader-stage]');
const track=document.querySelector('[data-audralia-loader-track]');
const fill=document.querySelector('[data-audralia-loader-fill]');
const progress=document.querySelector('[data-audralia-loader-progress]');
const elapsed=document.querySelector('[data-audralia-loader-elapsed]');
const started=performance.now();
const TOTAL=5;
let completed=-1;
const rows={
  surface:document.querySelector('[data-loader-system="surface"]'),
  clouds:document.querySelector('[data-loader-system="clouds"]'),
  regional:document.querySelector('[data-loader-system="regional"]'),
  local:document.querySelector('[data-loader-system="local"]')
};

function setRow(name,state){
  const row=rows[name];
  if(!row)return;
  row.dataset.state=state;
  const out=row.querySelector('b');
  if(out)out.textContent=state==='ready'?'ready':'waiting';
}

function commit(next,label){
  if(next<=completed)return;
  completed=next;
  const bounded=Math.max(0,Math.min(TOTAL,next));
  const ratio=bounded/TOTAL;
  if(stage)stage.textContent=label;
  if(progress)progress.textContent=`${Math.round(ratio*100)}% · ${bounded} of ${TOTAL} stages`;
  if(track){track.setAttribute('aria-valuenow',String(bounded));track.dataset.completed=String(bounded);}
  if(fill)fill.style.width=`${Math.round(ratio*100)}%`;
  if(loader)loader.dataset.progress=String(bounded);
}

function observe(){
  if(elapsed)elapsed.textContent=`${((performance.now()-started)/1000).toFixed(1)}s`;
  if(loader?.classList.contains('is-error'))return;
  if(document.querySelector('[data-audralia-clear-atmosphere="true"]')){
    setRow('surface','ready');
    commit(1,'Surface and atmosphere resolved');
  }
  if(globalThis.__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__){
    setRow('clouds','ready');
    commit(2,'Planetary cloud field online');
  }
  if(document.querySelector('[data-audralia-exterior-weather="true"]')){
    setRow('regional','ready');
    commit(3,'Regional weather online');
  }
  if(document.querySelector('[data-canonical-weather-projection="true"]')){
    setRow('local','ready');
    commit(4,'Local weather continuity online');
  }
  if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()?.invariants?.pass===true){
    commit(5,'Audralia ready');
    return;
  }
  requestAnimationFrame(observe);
}

commit(0,'Preparing terrain, atmosphere, and camera…');
requestAnimationFrame(observe);
